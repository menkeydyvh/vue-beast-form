import{v as s}from"./index-c96d6d1b.js";import{g as _,r,_ as b,M as a,p as v,U as A,V as m,N as l,t as g,R as n}from"./framework-23cc0af1.js";s.useFramework("ant-design-vue");const h=_({components:{BeastForm:s.beastForm()},setup(){const e=r([{type:"a-input",title:"form1的输入框",field:"name",props:{type:"text"}},{type:"a-button",field:"btn",children:["设置form2的输入框值"],on:{click:(o,t)=>{t.getApi("form2").setValue("name","通过getApi从form1设置form2的值")}}}]),i=r([{type:"a-input",title:"form2的输入框",field:"name",props:{type:"text"}},{type:"div",field:"fomr2div"},{type:"a-button",field:"btn",children:["设置form1的输入框值"],on:{click:(o,t)=>{t.getApi("form1").setValue("name","通过getApi从form2设置form1的值")}}}]),u=r({form:{layout:"vertical"}});return{rule1:e,rule2:i,option:u,setClick:()=>{const o=s.getApi("form2");o.pushChildren("fomr2div",{type:"div",children:["添加内容!!!"]}),console.log(o,o.getFormData())}}}}),k=n("div",null,null,-1),F=n("div",null,"beast-form：name=form1",-1),y=n("div",null,"beast-form：name=form2",-1),B=n("br",null,null,-1);function C(e,i,u,c,o,t){const p=a("beast-form"),f=a("a-button"),d=a("a-card");return v(),A(d,{class:"content-card",bordered:!1,title:"测试渲染示例"},{default:m(()=>[k,F,l(p,{name:"form1",rule:e.rule1,option:e.option},null,8,["rule","option"]),y,l(p,{name:"form2",rule:e.rule2,option:e.option},null,8,["rule","option"]),B,l(f,{onClick:e.setClick},{default:m(()=>[g("外部按钮点击")]),_:1},8,["onClick"])]),_:1})}const N=b(h,[["render",C],["__file","getApi.vue"]]);export{N as default};
