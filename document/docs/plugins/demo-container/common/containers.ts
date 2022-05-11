
import mdContainer from 'markdown-it-container'
import MarkdownIt from 'markdown-it'
import fs from 'fs'
import path from 'path'
import highlight from './highlight'

const localMd = MarkdownIt()

export default options => {
  const { component = 'demo-block', componentsDir, getComponentName } = options;
  const componentName = component
    .replace(/^\S/, (s: string) => s.toLowerCase())
    .replace(/([A-Z])/g, "-$1").toLowerCase();
  return md => {
    md.use(mdContainer, 'demo', {
      validate(params) {
        return params.trim().match(/^demo\s*(.*)$/);
      },
      render(tokens, idx) {
        const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/);
        if (tokens[idx].nesting === 1) {
          const description = m && m.length > 1 ? m[1] : '';
          const sourceFileToken = tokens[idx + 2]
          const sourceFile = sourceFileToken.children?.[0].content ?? ''
          let source = ''
          if (sourceFileToken.type === 'inline') {
            source = fs.readFileSync(
              path.resolve(`${componentsDir}/${sourceFile}.vue`),
              'utf-8'
            )
          }
          const cptName = getComponentName(sourceFile)
          const encodeOptionsStr = encodeURI(JSON.stringify(options));
          let result = `<${componentName} componentName="${cptName}" :options="JSON.parse(decodeURI('${encodeOptionsStr}'))"
          description="${encodeURIComponent(localMd.render(description))}"
          source="${encodeURIComponent(highlight(source, 'vue'))}"
          >
        `
          return result;
        }
        return `</${componentName}>`;
      }
    });
  };
}