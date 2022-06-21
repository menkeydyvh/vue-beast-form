import rules from '../rule/index';
import type { MenuType } from '../../types/menu';

export default class Menu {
    public menus: MenuType[] = [
        {
            tag: 'form',
            title: '表单组件',
            list: []
        },
        {
            tag: 'layout',
            title: '布局组件',
            list: []
        },
        {
            tag: 'other',
            title: '辅助组件',
            list: []
        },
    ]

    constructor() {
        this.init();
    }

    init() {
        rules.forEach(rule => {
            if (rule.tag) {
                const menu = this.menus.find(menu => menu.tag === rule.tag);
                if (menu) {
                    menu.list.push(rule);
                }
            }
        })
    }
}