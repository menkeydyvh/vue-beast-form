import{_ as n,p as s,q as a,a1 as t}from"./framework-23cc0af1.js";const p={},e=t(`<h1 id="按需加载" tabindex="-1"><a class="header-anchor" href="#按需加载" aria-hidden="true">#</a> 按需加载</h1><p>组件本身就是按需使用不需要全局加载，但组件依赖ui库，如ui库未在全局加载，则使用ui库的组件无法找到。但可通过如下方式解决：</p><p>xxx.vue</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> defineComponent <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;vue&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> Input <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;ant-design-vue&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> vbf <span class="token keyword">from</span> <span class="token string">&quot;vue-beast-form&quot;</span><span class="token punctuation">;</span>

<span class="token comment">// 按需引入ui库对应组件</span>
vbf<span class="token punctuation">.</span><span class="token function">components</span><span class="token punctuation">(</span><span class="token punctuation">{</span>Input<span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token comment">// 按需加载指令</span>
vbf<span class="token punctuation">.</span><span class="token function">directive</span><span class="token punctuation">(</span><span class="token string">&quot;test2&quot;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
  <span class="token function">mounted</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;directive:test2&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token function">setup</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>

    <span class="token comment">// 继续编写代码</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,4),o=[e];function c(i,u){return s(),a("div",null,o)}const d=n(p,[["render",c],["__file","demandLoad.html.vue"]]);export{d as default};
