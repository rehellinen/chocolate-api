import {BaseValidate} from "./BaseValidate"

export class OrganizationValidate extends BaseValidate{
  constructor() {
    super()
    this.rules = {
      ONAME: ['require', '名字'],
      OSIMPINTRO: ['require', '简介'],
      OINTRO: ['require', '介绍'],
      OPHONE: ['require', '电话'],
      OEMAIL: ['require', '邮箱'],
    }

    this.scene = {
      register: ['ONAME', 'OSIMPINTRO', 'OINTRO', 'OPHONE', 'OEMAIL']
    }
  }
}
