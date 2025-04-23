// eslint-plugin-bad4iz/rules/require-test-phases-comments.js
module.exports = {
  meta: {
    type: 'suggestion',
    fixable: 'code',
    docs: {
      description:
        'Enforce ☣️ Arrange/🔥 Act/❓ Assert comments in test blocks',
      category: 'Best Practices',
      recommended: false,
    },
    schema: [],
  },

  /**
   *
   * @param context
   */
  create(context) {
    const sourceCode = context.getSourceCode();
    const requiredComments = {
      arrange: { emoji: '☣️', text: 'Arrange (всякие моки)' },
      act: { emoji: '🔥', text: 'Act' },
      assert: { emoji: '❓', text: 'Assert' },
    };

    return {
      /**
       *
       * @param node
       */
      'CallExpression[callee.name="it"]'(node) {
        const testBody = node.arguments[1]?.body?.body;
        if (!testBody) return;

        const comments = sourceCode
          .getAllComments()
          .filter(
            (c) => node.range[0] < c.range[0] && c.range[1] < node.range[1],
          );

        const commentPatterns = {
          arrange: /arrange/i,
          act: /act/i,
          assert: /assert/i,
        };

        const foundComments = {
          arrange: null,
          act: null,
          assert: null,
        };

        // Find existing comments
        comments.forEach((comment) => {
          const commentText = comment.value.trim();

          Object.entries(commentPatterns).forEach(([key, pattern]) => {
            if (pattern.test(commentText)) {
              foundComments[key] = comment;
            }
          });
        });

        // Check and fix comments
        Object.entries(requiredComments).forEach(([key, config]) => {
          const expectedComment = `//${config.emoji} ${config.text}`;

          if (!foundComments[key]) {
            context.report({
              node,
              message: `Missing ${config.emoji} ${config.text} comment`,

              /**
               *
               * @param fixer
               */
              fix(fixer) {
                if (key === 'assert') {
                  // Ищем первый вызов expect
                  const expectNode = testBody.find(
                    (n) =>
                      n.type === 'ExpressionStatement' &&
                      n.expression.type === 'CallExpression' &&
                      n.expression.callee.name === 'expect',
                  );

                  if (expectNode) {
                    // Вставляем комментарий перед expect
                    return fixer.insertTextBefore(
                      expectNode,
                      `${expectedComment}\n`,
                    );
                  } else {
                    // Если expect не найден, вставляем в конец блока
                    return fixer.insertTextBefore(
                      testBody[testBody.length - 1],
                      `${expectedComment}\n`,
                    );
                  }
                } else {
                  // Для Arrange и Act вставляем в начало блока
                  return fixer.insertTextBefore(
                    testBody[0],
                    `${expectedComment}\n`,
                  );
                }
              },
            });
          } else {
            const existing = sourceCode.getText(foundComments[key]);
            if (!existing.startsWith(`//${config.emoji}`)) {
              context.report({
                node: foundComments[key],
                message: `Invalid format for ${config.text} comment`,

                /**
                 *
                 * @param fixer
                 */
                fix(fixer) {
                  return fixer.replaceText(foundComments[key], expectedComment);
                },
              });
            }
          }
        });
      },
    };
  },
};
