class HighlightArea extends HTMLElement {
    constructor() {
        super();
        // Attach Shadow DOM to encapsulate styles and markup, preventing global style leakage.
        this.attachShadow({ mode: 'open' });

        // Inject styles for the custom element and its context menu into the Shadow DOM.
        // This ensures the context menu's `position: absolute` correctly references
        // the host element, which is set to `position: relative`.
        this.shadowRoot.innerHTML = `
            <style>
                /* Add position: relative to the host element */
                :host {
                    display: block; /* Ensures the host takes up space and is a block-level element */
                    position: relative; /* Crucial for absolutely positioning the context menu within its boundaries */
                }

                /* CSS Custom Highlight styles are not part of this component's internal styles 
                   but are expected to be defined globally or injected dynamically for ::highlight() to work.
                   Example:
                   ::highlight(highlight-area-blue) { background-color: rgba(0, 0, 255, 0.4); }
                */

                /* Context Menu Styles - Now inside Shadow DOM for encapsulation */
                .highlight-context-menu {
                    position: absolute; /* Positions the menu relative to the :host element */
                    background-color: #333;
                    color: white;
                    padding: 8px 12px;
                    border-radius: 4px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                    z-index: 1000; /* Ensures the menu appears on top of other content */
                    display: flex;
                    gap: 8px; /* Spacing between menu items */
                    align-items: center;
                }

                .highlight-context-menu .color-swatch,
                .highlight-context-menu .remove-highlight-btn {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%; /* Makes them circular */
                    cursor: pointer;
                    border: 1px solid #555;
                    box-shadow: 0 0 3px rgba(255, 255, 255, 0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px; /* For icon/text within swatches */
                }

                .highlight-context-menu .remove-highlight-btn {
                    background-color: #666;
                    color: white;
                }

                .highlight-context-menu .remove-highlight-btn:hover {
                    background-color: #888;
                }
            </style>
            <slot></slot>`; // Renders the light DOM content inside the shadow root

        this._contextMenu = null; // Holds the reference to the created context menu element
        this._currentSelectionRange = null; // Stores a clone of the user's text selection range
        this._isApiSupported = false; // Flag to check if CSS Custom Highlight API is available
        this._debugLoggingEnabled = false; // Control debug logging

        // Define available highlight colors with their names and CSS values.
        this.availableColors = [
            { name: 'blue', cssColor: 'rgba(0, 0, 255, 1)' },
            { name: 'red', cssColor: 'rgba(255, 0, 0, 1)' },
            { name: 'green', cssColor: 'rgba(0, 128, 0, 1)' },
            { name: 'yellow', cssColor: 'rgba(255, 255, 0, 1)' },
            { name: 'purple', cssColor: 'rgba(128, 0, 128, 1)' },
        ];

        // Check for CSS Custom Highlight API support and initialize Highlight objects.
        if (typeof CSS !== 'undefined' && CSS.highlights) {
            this._isApiSupported = true;
            this.availableColors.forEach(color => {
                const highlightName = `highlight-area-${color.name}`;
                // Create a new Highlight object for each color if it doesn't already exist.
                if (!CSS.highlights.get(highlightName)) {
                    CSS.highlights.set(highlightName, new Highlight());
                }
            });
        } else {
            this._log("HighlightArea: CSS Custom Highlight API (CSS.highlights) not supported in this browser.", 'warn');
        }

        // Bind event handlers to the current instance (`this`) to ensure correct context.
        this._handlePointerUp = this._handlePointerUp.bind(this);
        this._handleSelectionChange = this._handleSelectionChange.bind(this);
        this._handleRepositionRequest = this._handleRepositionRequest.bind(this); // Bind the new reposition handler
    }

    /**
     * Custom logging utility, only logs if `_debugLoggingEnabled` is true.
     * Supports different log levels (e.g., 'warn', 'error').
     */
    _log(...messages) {
        if (this._debugLoggingEnabled) {
            let level = 'log'; // Default log level

            // If the last argument is a valid log level string, use it and remove it from messages.
            const lastArg = messages[messages.length - 1];
            const possibleLevels = ['log', 'info', 'warn', 'error', 'debug', 'trace'];
            if (typeof lastArg === 'string' && possibleLevels.includes(lastArg)) {
                level = messages.pop();
            }

            const prefix = `[HighlightArea${this.id ? '#' + this.id : ''}]`; // Add component ID for easier debugging
            const output = [prefix, ...messages];

            // Use the specified console method, or fallback to `console.log`.
            if (console[level]) {
                console[level](...output);
            } else {
                console.log(...output);
            }
        }
    }

    /**
     * Lifecycle callback: Called when the element is added to the DOM.
     * Sets up event listeners for selection and context menu management.
     */
    connectedCallback() {
        this._log(`connected. API Supported: ${this._isApiSupported}`);
        this.addEventListener('mouseup', this._handlePointerUp);
        document.addEventListener('selectionchange', this._handleSelectionChange);

        // Add event listeners for repositioning the context menu on viewport changes.
        window.addEventListener('resize', this._handleRepositionRequest);
        // Use capture phase for scroll events on window to catch them early.
        window.addEventListener('scroll', this._handleRepositionRequest, true);
        // Also listen for scroll events directly on the host element.
        this.addEventListener('scroll', this._handleRepositionRequest);

        // Ensure a global pointerdown listener is added only once across all instances
        // to manage context menu dismissal when clicking outside.
        if (!HighlightArea._globalPointerDownListenerAdded) {
            document.addEventListener('pointerdown', HighlightArea._handleGlobalPointerDown, true);
            HighlightArea._globalPointerDownListenerAdded = true;
            HighlightArea._activeEditors = new Set(); // Initialize a set to track active HighlightArea instances
            this._log("Global pointerdown listener for context menu management added.");
        }
        HighlightArea._activeEditors.add(this); // Add this instance to the set of active editors
    }

    /**
     * Lifecycle callback: Called when the element is removed from the DOM.
     * Cleans up event listeners and the context menu.
     */
    disconnectedCallback() {
        this._log("disconnected.");
        this.removeEventListener('mouseup', this._handlePointerUp);
        document.removeEventListener('selectionchange', this._handleSelectionChange);

        // Remove repositioning listeners to prevent memory leaks.
        window.removeEventListener('resize', this._handleRepositionRequest);
        window.removeEventListener('scroll', this._handleRepositionRequest, true);
        this.removeEventListener('scroll', this._handleRepositionRequest);

        this._removeContextMenu(); // Ensure context menu is removed when the component is disconnected
        HighlightArea._activeEditors.delete(this); // Remove this instance from the active editors set
    }

    /**
     * Static method to handle global pointerdown events.
     * Used to dismiss context menus if the click occurs outside any active HighlightArea instance or its menu.
     */
    static _handleGlobalPointerDown(event) {
        // Iterate over all active HighlightArea instances.
        for (const editor of HighlightArea._activeEditors) {
            if (!editor._contextMenu) continue; // Skip if no context menu is open for this editor

            const path = event.composedPath(); // Get the event's composed path to check elements across shadow boundaries
            // Determine if the click was inside the editor itself or its context menu.
            const isClickInsideEditorOrMenu = path.includes(editor) || (editor._contextMenu && path.includes(editor._contextMenu));

            if (!isClickInsideEditorOrMenu) {
                editor._log("Global click outside editor and menu, removing context menu.");
                editor._removeContextMenu(); // Dismiss the menu
            } else {
                editor._log("Global click inside editor or menu.");
                const selection = window.getSelection();
                // If the click is inside the editor but not on the menu, and the selection has collapsed,
                // it implies the user clicked away from a selection, so dismiss the menu.
                if (path.includes(editor) && !path.includes(editor._contextMenu) && selection && selection.isCollapsed) {
                    editor._log("Click inside editor collapsed selection, removing context menu.");
                    editor._removeContextMenu();
                }
            }
        }
    }

    /**
     * Handles the 'selectionchange' event.
     * Currently primarily used in conjunction with `_handleGlobalPointerDown` for dismissal logic,
     * not for direct menu repositioning or display.
     */
    _handleSelectionChange() {
        if (!this._isApiSupported) return;
        // This method is intentionally left light as `_handlePointerUp` handles menu display/repositioning on selection completion.
    }

    /**
     * Handles the 'mouseup' event.
     * This is the primary trigger for showing the context menu after a text selection is made.
     */
    _handlePointerUp(event) {
        if (!this._isApiSupported) return;
        this._log("_handlePointerUp triggered.");

        // If the click was inside the context menu itself, do not dismiss it or create a new one.
        if (this._contextMenu && this._contextMenu.contains(event.target)) {
            this._log("Click was inside context menu, ignoring for new selection.");
            return;
        }

        this._removeContextMenu(); // Always remove any existing menu before checking for a new selection

        const selection = window.getSelection();
        // Check if there's an active, non-collapsed selection.
        if (selection && !selection.isCollapsed && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const commonAncestor = range.commonAncestorContainer;
            // Check if the selection's common ancestor is within this custom element's light DOM.
            const isWithinComponent = this.contains(commonAncestor) || (commonAncestor.nodeType === Node.TEXT_NODE && this.contains(commonAncestor.parentNode));

            this._log(`Selection made: "${selection.toString().trim().substring(0, 50)}..."`);

            // If a non-empty selection is made within this component.
            if (selection.toString().trim().length > 0 && isWithinComponent) {
                this._currentSelectionRange = range.cloneRange(); // Store a clone of the range
                this._showContextMenu(range); // Show the context menu
            } else {
                this._currentSelectionRange = null; // Clear stored range if selection is invalid/outside
                if (!isWithinComponent) this._log("Selection is not within this component's light DOM.");
            }
        } else {
            this._log("No active selection or selection is collapsed.");
            this._currentSelectionRange = null; // Clear stored range if selection collapses
        }
    }

    /**
     * New handler for repositioning events (resize, scroll).
     * If a context menu is open and there's a stored selection, it attempts to reposition the menu.
     */
    _handleRepositionRequest() {
        // Only reposition if a menu is currently open AND there's a stored selection range.
        if (this._contextMenu && this._currentSelectionRange) {
            this._log("Reposition request received (resize/scroll). Attempting to re-show context menu.");
            // Re-call `_showContextMenu` with the stored range to recalculate its position.
            this._showContextMenu(this._currentSelectionRange);
        } else {
            this._log("Reposition request received, but no active menu/selection.");
        }
    }

    /**
     * Creates and appends the context menu to the Shadow DOM.
     * Populates it with color swatches and a remove button.
     */
    _createContextMenu() {
        if (this._contextMenu) {
            this._removeContextMenu(); // Remove any existing menu first
        }

        this._contextMenu = document.createElement('div');
        this._contextMenu.className = 'highlight-context-menu';
        // Note: Position styles are also in CSS, but explicitly setting here can be useful for debugging.
        this._contextMenu.style.position = 'absolute';
        this._contextMenu.style.zIndex = '1000';

        // Create color swatches for each available color.
        this.availableColors.forEach(colorInfo => {
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.style.backgroundColor = colorInfo.cssColor;
            swatch.dataset.colorName = colorInfo.name; // Store color name for easy retrieval
            swatch.title = `Highlight ${colorInfo.name}`;

            // Prevent default pointerdown behavior to avoid issues with selection/focus.
            swatch.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Stop propagation to prevent global pointerdown from dismissing immediately
                this._log(`Color swatch '${colorInfo.name}' pointerdown.`);
                if (this._currentSelectionRange) {
                    this._applyHighlight(colorInfo.name);
                } else {
                    this._log("No current selection range, removing context menu.");
                    this._removeContextMenu();
                }
            });
            // Dismiss menu after pointerup (release) on the swatch.
            swatch.addEventListener('pointerup', (e) => {
                e.stopPropagation();
                this._log(`Color swatch '${colorInfo.name}' pointerup, removing menu.`);
                this._removeContextMenuAfterAction();
            });
            this._contextMenu.appendChild(swatch);
        });

        // Create the "remove highlight" button.
        const removeBtn = document.createElement('div');
        removeBtn.className = 'remove-highlight-btn';
        removeBtn.innerHTML = '&times;'; // HTML entity for 'x'
        removeBtn.title = 'Remove highlights in selection';
        // Apply inline styles for centering the 'x'
        removeBtn.style.fontSize = '20px';
        removeBtn.style.lineHeight = '20px';
        removeBtn.style.verticalAlign = 'middle';
        removeBtn.style.textAlign = 'center';
        removeBtn.style.cursor = 'pointer';

        // Event listeners for the remove button, similar to color swatches.
        removeBtn.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this._log("Remove button pointerdown.");
            if (this._currentSelectionRange) {
                this._handleRemoveHighlights();
            } else {
                this._log("No current selection range, removing context menu.");
                this._removeContextMenu();
            }
        });
        removeBtn.addEventListener('pointerup', (e) => {
            e.stopPropagation();
            this._log("Remove button pointerup, removing menu.");
            this._removeContextMenuAfterAction();
        });

        this._contextMenu.appendChild(removeBtn);

        this.shadowRoot.appendChild(this._contextMenu); // Append the menu to the Shadow DOM
        this._log("Context menu created and appended to Shadow DOM.");
    }

    /**
     * Clears the current selection and removes the context menu after a highlight action.
     * Uses `Promise.resolve().then()` to defer menu removal slightly, allowing browser to process selection changes.
     */
    _removeContextMenuAfterAction() {
        window.getSelection().removeAllRanges(); // Clear the active selection
        this._currentSelectionRange = null; // Clear the stored range

        // Defer removal slightly to ensure the browser has processed the action (e.g., highlighting).
        Promise.resolve().then(() => {
            this._removeContextMenu();
            this._log("Context menu removal scheduled after action.");
        });
    }

    /**
     * Helper function to find the nearest scrollable or clipping container for an element.
     * This is crucial for correctly positioning the context menu within its visible bounds.
     */
    _getNearestClippingContainer(element) {
        let el = element;

        while (el) {
            // Check computed styles for overflow properties.
            const style = el instanceof HTMLElement ? getComputedStyle(el) : null;
            const hasClipping = style && /(auto|scroll|hidden|clip)/.test(style.overflow + style.overflowY + style.overflowX);

            // Special handling for Ionic's `ion-content` which has internal scrollable elements in its Shadow DOM.
            if (el.tagName === 'ION-CONTENT' && el.shadowRoot) {
                const scrollEl = el.shadowRoot.querySelector('.inner-scroll') || el.shadowRoot.querySelector('.scroll-y');
                if (scrollEl) return scrollEl;
            }

            // If an element has clipping overflow and a bounding rectangle, it's a candidate.
            if (hasClipping && el.getBoundingClientRect) {
                return el;
            }

            // Traverse up the DOM tree: parentElement for normal DOM, getRootNode().host for Shadow DOM parents.
            el = el.parentElement || el.getRootNode().host || null;
        }

        // Fallback: If no clipping container is found, consider the document/viewport as the clipping container.
        return null;
    }

    /**
     * Helper function to calculate the visible rectangle of an element within its nearest scrollable container.
     * This helps ensure the context menu stays within the user's view and within the element's scrollable context.
     */
    _getVisibleRectInScrollContainer(el) {
        const clipContainer = this._getNearestClippingContainer(el);
        const elRect = el.getBoundingClientRect(); // Element's position relative to viewport

        // Determine the container's rectangle: use clipContainer's rect or fallback to viewport.
        const containerRect = clipContainer?.getBoundingClientRect?.() ?? {
            top: 0, left: 0, bottom: window.innerHeight, right: window.innerWidth
        };

        // Calculate the intersection of the element's rect and the container's rect.
        const visibleRect = {
            top: Math.max(elRect.top, containerRect.top),
            left: Math.max(elRect.left, containerRect.left),
            bottom: Math.min(elRect.bottom, containerRect.bottom),
            right: Math.min(elRect.right, containerRect.right),
        };

        visibleRect.width = Math.max(0, visibleRect.right - visibleRect.left);
        visibleRect.height = Math.max(0, visibleRect.bottom - visibleRect.top);

        // Return the visible rectangle only if it has positive width and height.
        return (visibleRect.width > 0 && visibleRect.height > 0) ? visibleRect : null;
    }


    /**
     * Displays and positions the context menu based on the selection range.
     * It attempts to position the menu above or below the selection, clamping it
     * within the visible area of its scrollable container and the host element.
     */
    _showContextMenu(range) {
        this._log("Showing context menu...");
        this._createContextMenu(); // Ensure the menu element exists

        // Use requestAnimationFrame to ensure the menu's dimensions are calculated after rendering.
        requestAnimationFrame(() => {
            if (!this._contextMenu) {
                this._log("Context menu not found after creation attempt.", 'error');
                return;
            }

            const EDGE_PADDING = 5; // Padding from screen/container edges
            this._log("Context menu found, positioning...");

            const rect = range.getBoundingClientRect(); // Bounding rect of the text selection
            const hostRect = this.getBoundingClientRect(); // Bounding rect of the custom element host
            const contextMenuRect = this._contextMenu.getBoundingClientRect(); // Bounding rect of the context menu
            this._log("hostRect:", hostRect);

            // Get the visible area where the element and thus the menu can appear.
            const visibleRect = this._getVisibleRectInScrollContainer(this);
            this._log("visibleRect:", visibleRect);

            // If the host element itself is not visible, remove the menu.
            if (!visibleRect) {
                this._log("Element is not visible within its scrollable container or viewport. Removing context menu.", 'warn');
                this._removeContextMenu();
                return;
            }

            let finalViewportTop;
            let finalViewportLeft;

            // --- Vertical Positioning Strategy ---
            // Calculate potential positions: above selection or below selection.
            let topCandidate = rect.top - contextMenuRect.height - EDGE_PADDING;
            let bottomCandidate = rect.bottom + EDGE_PADDING;

            // Check if placing above is feasible (within visible area AND above host's top).
            const canPlaceAbove = (topCandidate >= visibleRect.top) &&
                (topCandidate >= hostRect.top);

            // Check if placing below is feasible (within visible area AND below host's bottom).
            const canPlaceBelow = (bottomCandidate + contextMenuRect.height <= visibleRect.bottom - EDGE_PADDING) &&
                (bottomCandidate + contextMenuRect.height <= hostRect.bottom);

            if (canPlaceAbove) {
                finalViewportTop = topCandidate;
                this._log("Placing menu above selection.");
            } else if (canPlaceBelow) {
                finalViewportTop = bottomCandidate;
                this._log("Placing menu below selection.");
            } else {
                // If neither above nor below works perfectly, try to center it vertically within the visible area.
                this._log("Cannot place menu without covering selection or outside host/viewport. Attempting best fit (centered in visibleRect).");
                finalViewportTop = visibleRect.top + (visibleRect.height / 2) - (contextMenuRect.height / 2);
            }

            // --- Horizontal Positioning (centered above/below, then clamped) ---
            // Center horizontally relative to the selection.
            finalViewportLeft = rect.left + (rect.width / 2) - (contextMenuRect.width / 2);


            // --- Apply visibleRect clamping to the chosen vertical and horizontal positions ---
            // Ensure the menu stays within the visible area defined by `visibleRect`.
            finalViewportTop = Math.min(finalViewportTop, visibleRect.bottom - contextMenuRect.height - EDGE_PADDING);
            finalViewportTop = Math.max(finalViewportTop, visibleRect.top + EDGE_PADDING);

            finalViewportLeft = Math.min(finalViewportLeft, visibleRect.right - contextMenuRect.width - EDGE_PADDING);
            finalViewportLeft = Math.max(visibleRect.left + EDGE_PADDING, finalViewportLeft);


            // --- Now, convert viewport-relative positions to host-relative positions ---
            // The context menu is positioned absolutely within the Shadow DOM, which means its
            // `top` and `left` are relative to the `:host` element.
            let finalLeftStyle = finalViewportLeft - hostRect.left;
            let finalTopStyle = finalViewportTop - hostRect.top;

            // --- Apply host element clamping (additional clamping for internal positioning) ---
            // Ensure the menu doesn't go outside the host's actual boundaries.
            finalLeftStyle = Math.min(finalLeftStyle, hostRect.width - contextMenuRect.width);
            finalLeftStyle = Math.max(finalLeftStyle, 0);

            finalTopStyle = Math.min(finalTopStyle, hostRect.height - contextMenuRect.height);
            finalTopStyle = Math.max(finalTopStyle, 0);


            // Apply the final calculated positions.
            this._contextMenu.style.left = `${finalLeftStyle}px`;
            this._contextMenu.style.top = `${finalTopStyle}px`;

            this._log(`Showing context menu at (relative to host): T=${finalTopStyle}px, L=${finalLeftStyle}px. (Viewport T=${finalViewportTop}, L=${finalViewportLeft})`);
        });
    }

    /**
     * Removes the context menu from the Shadow DOM if it exists.
     */
    _removeContextMenu() {
        if (this._contextMenu) {
            if (this.shadowRoot.contains(this._contextMenu)) {
                this._contextMenu.remove(); // Remove the element from the DOM
                this._log("Context menu removed from Shadow DOM.");
            }
            this._contextMenu = null; // Clear the reference
        }
    }

    /**
     * Checks if two DOM `Range` objects overlap.
     * @param {Range} range1 - The first range.
     * @param {Range} range2 - The second range.
     * @returns {boolean} True if the ranges overlap, false otherwise.
     */
    _rangesOverlap(range1, range2) {
        // An overlap exists if range1 starts before range2 ends AND range1 ends after range2 starts.
        return range1.compareBoundaryPoints(range1.START_TO_END, range2) > 0 &&
            range1.compareBoundaryPoints(range1.END_TO_START, range2) < 0;
    }

    /**
     * Clears any ranges within a specific highlight group that overlap with a given range.
     * Used to remove existing highlights of a different color or to remove highlights entirely.
     * @param {Range} rangeToClear - The range defining the area to clear.
     * @param {Highlight} highlightGroup - The Highlight object (Set of Ranges) to clear from.
     * @param {string} groupNameForLogging - A descriptive name for logging purposes.
     */
    _clearRangeFromSpecificHighlightGroup(rangeToClear, highlightGroup, groupNameForLogging) {
        if (!rangeToClear || !highlightGroup) return;

        const rangesToRemove = [];
        highlightGroup.forEach(existingRange => {
            if (this._rangesOverlap(rangeToClear, existingRange)) {
                rangesToRemove.push(existingRange);
            }
        });

        if (rangesToRemove.length > 0) {
            this._log(`Clearing ${rangesToRemove.length} overlapping ranges from '${groupNameForLogging}'.`);
            rangesToRemove.forEach(range => {
                highlightGroup.delete(range); // Remove the overlapping range from the Highlight group
            });
        }
    }

    /**
     * Adds a new range to a highlight group, merging it with any existing overlapping ranges
     * within that same group to create a continuous highlight.
     * @param {Range} range - The new range to add/merge.
     * @param {Highlight} highlightGroup - The Highlight object (Set of Ranges) to add to.
     * @param {string} groupNameForLogging - A descriptive name for logging purposes.
     */
    _addAndMergeRanges(range, highlightGroup, groupNameForLogging) {
        highlightGroup.forEach(existingRange => {
            // Check for overlap:
            // No overlap if existingRange ends before rangeToClear starts, OR existingRange starts after rangeToClear ends.
            const overlap = existingRange.compareBoundaryPoints(range.START_TO_END, range) >= 0 &&
                existingRange.compareBoundaryPoints(range.END_TO_START, range) <= 0;

            if (overlap) {
                // overlappingRanges.push(existingRange);
                const startBefore = existingRange.compareBoundaryPoints(range.START_TO_START, range) < 0;
                if (startBefore) {
                    range.setStart(existingRange.startContainer, existingRange.startOffset);
                }
                const endAfter = existingRange.compareBoundaryPoints(range.END_TO_END, range) > 0;
                if (endAfter) {
                    range.setEnd(existingRange.endContainer, existingRange.endOffset);
                }
                this._log(`[${this.id || 'anonymous'}] Overlap for adding: range ("${range.toString().substring(0, 30)}") vs. existing '${groupNameForLogging}' ("${existingRange.toString().substring(0, 30)}")`);
                highlightGroup.delete(existingRange); // Remove the existing range from the group
            }
        });
        highlightGroup.add(range); // Add the new range to the group
    }


    /**
     * Applies a highlight of a specified color to the currently selected text.
     * It first removes any existing highlights of other colors from the selection area,
     * then adds the new highlight, merging with existing highlights of the same color.
     * @param {string} colorName - The name of the color to apply (e.g., 'blue', 'red').
     */
    _applyHighlight(colorName) {
        if (!this._isApiSupported || !this._currentSelectionRange) {
            this._log("Attempted to apply highlight, but API not supported or no selection.", 'warn');
            return;
        }

        const rangeToApply = this._currentSelectionRange.cloneRange(); // Work with a clone to avoid modifying the live selection
        this._log(`Applying highlight: ${colorName} to range: "${rangeToApply.toString().trim().substring(0, 50)}"`);

        const targetHighlightName = `highlight-area-${colorName}`;

        // Iterate through all existing highlight groups.
        // CSS.highlights.forEach((highlightGroup, groupName) => {
        //     // If the current group is NOT the target color, clear any overlapping ranges from it.
        //     if (groupName !== targetHighlightName) {
        //         this._clearRangeFromSpecificHighlightGroup(rangeToApply, highlightGroup, groupName);
        //     }
        // });

        // Get or create the target highlight group for the selected color.
        let targetHighlightGroup = CSS.highlights.get(targetHighlightName);
        if (!targetHighlightGroup) {
            this._log(`Target highlight group '${targetHighlightName}' not found during apply, creating.`, 'error');
            targetHighlightGroup = new Highlight();
            CSS.highlights.set(targetHighlightName, targetHighlightGroup);
        }

        // Add the new range to the target highlight group.
        // This will automatically merge with existing highlights of the same color if they overlap.
        this._addAndMergeRanges(rangeToApply, targetHighlightGroup, targetHighlightName);
        this._log(`Added new selection to '${targetHighlightName}'. New size: ${targetHighlightGroup.size}`);

        this._log("CSS.highlights after apply:", new Map(CSS.highlights.entries()));
    }

    /**
     * Removes all highlights that overlap with the currently selected text.
     */
    _handleRemoveHighlights() {
        if (!this._isApiSupported || !this._currentSelectionRange) {
            this._log("Attempted to remove highlights, but API not supported or no selection.", 'warn');
            return;
        }
        const rangeToClear = this._currentSelectionRange.cloneRange(); // Work with a clone
        this._log(`Request to remove highlights overlapping with: "${rangeToClear.toString().trim().substring(0, 50)}"`);

        // Iterate through all highlight groups and clear overlapping ranges from each.
        CSS.highlights.forEach((highlightGroup, groupName) => {
            this._clearRangeFromSpecificHighlightGroup(rangeToClear, highlightGroup, groupName);
        });

        this._log("CSS.highlights after removal:", new Map(CSS.highlights.entries()));
    }

    /**
     * Public method to clear all highlights across all highlight groups managed by this component.
     */
    clearAllHighlights() {
        if (!this._isApiSupported) {
            this._log("Attempted to clear all highlights, but API not supported.", 'warn');
            return;
        }
        this._log("Clearing all highlights.");
        CSS.highlights.forEach((highlightGroup, groupName) => {
            highlightGroup.clear(); // Clear all ranges from this highlight group
            this._log(`Cleared group: ${groupName}`);
        });
        this._log("All highlights cleared.");
    }
}

// --- Static Properties for Global Management ---
// Flag to ensure the global pointerdown listener is added only once.
HighlightArea._globalPointerDownListenerAdded = false;
// A Set to keep track of all active HighlightArea instances, used by the global listener.
HighlightArea._activeEditors = new Set();

// Define the custom element 'highlight-area' so it can be used in HTML.
customElements.define('highlight-area', HighlightArea);