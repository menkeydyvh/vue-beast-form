import{_ as e,M as p,p as t,q as o,R as n,t as s,N as i,a1 as c}from"./framework-23cc0af1.js";const l={},r=n("h1",{id:"国际化",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#国际化","aria-hidden":"true"},"#"),s(" 国际化")],-1),u={href:"https://www.npmjs.com/package/vue-i18n/v/next",target:"_blank",rel:"noopener noreferrer"},d=c(`<h2 id="启用" tabindex="-1"><a class="header-anchor" href="#启用" aria-hidden="true">#</a> 启用</h2><p>/lang/index.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> createI18n <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue-i18n&#39;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">createI18n</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token literal-property property">legacy</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
    <span class="token literal-property property">globalInjection</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token literal-property property">locale</span><span class="token operator">:</span> <span class="token string">&#39;en-us&#39;</span><span class="token punctuation">,</span>
    <span class="token literal-property property">messages</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token string-property property">&quot;zh-cn&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
            <span class="token string-property property">&quot;支持&quot;</span><span class="token operator">:</span> <span class="token string">&quot;支持&quot;</span><span class="token punctuation">,</span>
            <span class="token operator">...</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token string-property property">&quot;en-us&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
            <span class="token string-property property">&quot;支持&quot;</span><span class="token operator">:</span> <span class="token string">&quot;support&quot;</span><span class="token punctuation">,</span>
           <span class="token operator">...</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token operator">...</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>main.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> createApp <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;vue&#39;</span>
<span class="token keyword">import</span> App <span class="token keyword">from</span> <span class="token string">&#39;./App.vue&#39;</span>
<span class="token keyword">import</span> Antd <span class="token keyword">from</span> <span class="token string">&#39;ant-design-vue&#39;</span>
<span class="token keyword">import</span> <span class="token string">&#39;ant-design-vue/dist/antd.css&#39;</span>

<span class="token keyword">import</span> i18n <span class="token keyword">from</span> <span class="token string">&#39;./lang/index&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> app <span class="token operator">=</span> <span class="token function">createApp</span><span class="token punctuation">(</span>App<span class="token punctuation">)</span>

app<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>i18n<span class="token punctuation">)</span>
<span class="token operator">...</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="规则支持" tabindex="-1"><a class="header-anchor" href="#规则支持" aria-hidden="true">#</a> 规则支持</h2><p>如下<strong>支持</strong></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> rules <span class="token operator">=</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
        <span class="token literal-property property">title</span><span class="token operator">:</span><span class="token string">&quot;支持&quot;</span><span class="token punctuation">,</span>
        <span class="token literal-property property">children</span><span class="token operator">:</span><span class="token punctuation">[</span>
            <span class="token string">&quot;支持&quot;</span>
        <span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token literal-property property">validate</span><span class="token operator">:</span><span class="token punctuation">[</span>
            <span class="token punctuation">{</span><span class="token literal-property property">message</span><span class="token operator">:</span><span class="token string">&quot;支持&quot;</span><span class="token punctuation">}</span>
        <span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token literal-property property">on</span><span class="token operator">:</span><span class="token punctuation">{</span>
            <span class="token function-variable function">click</span><span class="token operator">:</span><span class="token punctuation">(</span><span class="token parameter">e<span class="token punctuation">,</span>api</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
                <span class="token keyword">const</span> i18nStr <span class="token operator">=</span> api<span class="token punctuation">.</span><span class="token function">$t</span><span class="token punctuation">(</span><span class="token string">&#39;支持&#39;</span><span class="token punctuation">)</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,8);function k(v,m){const a=p("ExternalLinkIcon");return t(),o("div",null,[r,n("p",null,[s("目前测试过的使用的多语言库为："),n("a",u,[s("vue-i18n"),i(a)])]),d])}const y=e(l,[["render",k],["__file","i18n.html.vue"]]);export{y as default};
