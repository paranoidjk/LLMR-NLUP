import { defineStore } from 'pinia'
type File = {
    name: string
    content: string,
    preview: string
    page: Page
}
type Page = {
    codes: string[],
    codesIndex: number
    prototype: string,
    id: number
}
type State = {
    page: Page,
    setting: {
        settingDialogVisible: boolean,
        sk: string
        model: string
        maxTokens: string
    },
    controlPanel: {
        forceRender: boolean
        freeze: boolean,
        action: 'generate' | 'edit'
    },
    drawer: {
        visible: boolean,
        files: Record<number, File>
    }

}
export const useMajorStore = defineStore('major', {
    state: (): State => {
        return {
            page: {
                codes: [],
                codesIndex: -1,
                id: 0,
                prototype: '',
            },
            setting: {
                settingDialogVisible: false,
                sk: '',
                model: 'gpt-3.5-turbo',
                maxTokens: "2500"
            },
            drawer: {
                visible: false,
                files: {},
            },
            controlPanel: {
                forceRender: false,
                freeze: false,
                action: 'generate'
            }
        }
    },
    getters: {
        code: (state) => {
            return state.page.codesIndex >= 0 ? state.page.codes[state.page.codesIndex].trim() : ""
        },
    },
    actions: {
        setPage(file: File) {
            this.page = file.page
        },
        deletePage() {
            delete this.drawer.files[this.page.id]
            const keyList = Object.keys(this.drawer.files)
            if (keyList.length > 0) {
                this.page = this.drawer.files[keyList[0] as unknown as number].page
            } else {
                this.page = {
                    codes: [],
                    codesIndex: -1,
                    id: 0,
                    prototype: '',
                }
            }
        },
        newPage() {
            this.page = {
                codes: [],
                codesIndex: -1,
                id: 0,
                prototype: '',
            }
            this.controlPanel.action = 'generate'
        },
        initHistory(code: string) {
            this.page.codes.push(code)
            this.page.codesIndex = this.page.codes.length - 1
            this.page.id = new Date().getTime();
            this.drawer.files[this.page.id] = {
                name: `Untitled-${this.page.id}`,
                content: '',
                preview: '',
                page: this.page
            };

        },
        addHistory(code: string) {
            this.page.codes.splice(this.page.codesIndex + 1)
            this.page.codes.push(code)
            this.page.codesIndex = this.page.codes.length - 1
        },
        pre() {
            if (this.page.codesIndex > 0) {
                this.page.codesIndex--
            }
        },
        next() {
            if (this.page.codesIndex < this.page.codes.length - 1) {
                this.page.codesIndex++
            }
        },
        clear() {
            this.page.codes = []
            this.page.codesIndex = -1
        },
        openDrawer() {
            this.drawer.visible = true
        },
        openSettingDialog() {
            this.setting.settingDialogVisible = true
        },
        closeSettingDialog() {
            this.setting.settingDialogVisible = false
        },
        reset() {

             this.page = {
                codes: [],
                codesIndex: -1,
                id: 0,
                prototype: '',
            }
             this.setting  = {
                settingDialogVisible: false,
                sk: '',
                model: 'gpt-3.5-turbo',
                maxTokens: "1500"
            }
             this.drawer = {
                visible: false,
                files: this.drawer.files,
            }
             this.controlPanel = {
                forceRender: false,
                freeze: false,
                action: 'generate'
             }
        }
    },
})