// Регулярное выражение для поиска пустых массивов в JSDoc-комментариях
// const jsdocRegex = /(?<=@(param|returns).*?)\[.*?\]*?\}/;

const jsdocRegex = /(?<=@(param|returns)[^{]*\{[^}]*?)\[.*?\](?!:)[^}]*?\}/;
// /(?<=@returns.*?)\[.*?\]/;
// /(?=@(param|returns|return))[^{}]*{[^{}]*\[\s*.*?\s*]*}/;

// @ts-check
/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  /**
   * Она должна вернуть объект с обратными вызовами. Эти вызовы будет совершаться при обходе AST нашего исходного кода.
   *
   * @param {*} context - Context.
   * @returns {*}
   */
  create: function(context) {
    return {
      /**
       * Program.
       *
       * @returns {void}
       */
      Program() {
        const comments = context.sourceCode.getAllComments();
        comments?.forEach((comment_) => {
          const comment = comment_.value.trim();
          const lines = comment.split('\n');

          lines.forEach((line, index) => {
            const match = jsdocRegex.exec(line);
            if (match) {
              context.report({
                loc: {
                  end: {
                    column: match.index + match[0].length,
                    line: comment_.loc.start.line + index,
                  },
                  start: {
                    column: match.index,
                    line: comment_.loc.start.line + index,
                  },
                },
                message:
                  '💩 [] не допускаются в комментариях к JSDoc ипользуй Array',
                node: comment_,
              });
            }
          });

          //
          // // Проверяем, содержит ли комментарий запрещенный паттерн
          // if (jsdocRegex.test(comment.value)) {
          // const relevantLine = comment.value
          //   .split('\n')
          //   .filter((line) => jsdocRegex.test(line));
          //
          // context.report({
          //   message:
          //     '💩 [] не допускаются в комментариях к JSDoc ипользуй Array \n' +
          //     relevantLine.join('\n') +
          //     '\n',
          //   node: comment,
          // });
          // }
        });
      },
    };
  },
  meta: {
    docs: {
      category: 'Best Practices',
      description: 'Disallow the use of empty arrays in JSDoc comments',
      recommended: true,
    },
    schema: [], // Если ваше правило требует настройки, вы можете определить здесь параметры
    type: 'problem',
  },
};
