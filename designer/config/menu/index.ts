import rules from '../rule/index';
import type { MenuType } from '../../types/menu';
import type { ConfigRuleType } from '../../types/rule';

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

    getMenus() {
        return this.menus.map(menu => {
            const newMenu = { ...menu }
            newMenu.list = menu.list.filter(list => list.showMenu === false ? false : true)
            return newMenu
        })
    }

    getRule(name: string): ConfigRuleType {
        let data;
        this.menus.forEach(menu => {
            if (!data) {
                data = menu.list.find(item => item.name === name)
            }
        })
        return data
    }
}