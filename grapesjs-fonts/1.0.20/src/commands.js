import { getHtml, saveFonts, loadFonts } from './fonts'

export const cmdGetCss = 'get-fonts-css'
export const cmdGetHtml = 'get-fonts-html'
export const cmdSaveFonts = 'save-fonts'
export const cmdLoadFonts = 'load-fonts'

export default function (editor, defaultOptions = {}) {
    editor.Commands.add(cmdGetCss, () => {
        throw new Error('Not implemented')
    })
    editor.Commands.add(cmdGetHtml, (editor) => {
        const fonts = editor.getModel().get('fonts') || []
        return getHtml(fonts)
    })
    editor.Commands.add(cmdSaveFonts, (editor, sender, options = {}) => {
        saveFonts(editor, options.fonts ?? [], { ...defaultOptions, ...options.opts })
    })
    editor.Commands.add(cmdLoadFonts, (editor) => {
        return loadFonts(editor)
    })
}
