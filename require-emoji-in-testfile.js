// require-test-emoji-in-describe-and-it.js
module.exports = {
  meta: {
    type: 'suggestion', // Тип правила
    fixable: 'code', // Правило может автоматически исправлять код
    docs: {
      description:
        'Require 🐛 emoji in describe blocks and 🧪 emoji in it blocks in test files',
      category: 'Best Practices',
      recommended: false,
    },
    schema: [], // Нет дополнительных опций
  },

  /**
   *
   * @param context
   */
  create(context) {
    return {
      // Обработка describe блоков

      /**
       *
       * @param node
       */
      CallExpression(node) {
        // Проверяем, что это вызов describe
        if (node.callee.name === 'describe') {
          const firstArg = node.arguments[0];

          // Проверяем, что первый аргумент - это строка и она не содержит 🐛
          if (
            firstArg &&
            firstArg.type === 'Literal' &&
            typeof firstArg.value === 'string' &&
            !firstArg.value.includes('🐛')
          ) {
            context.report({
              node: firstArg,
              message: 'Describe block should include 🐛 emoji',

              /**
               *
               * @param fixer
               */
              fix(fixer) {
                // Автоматически добавляем 🐛 в начало строки
                const newText = `'🐛 ${firstArg.value}'`;
                return fixer.replaceText(firstArg, newText);
              },
            });
          }
        }

        // Проверяем, что это вызов it
        if (node.callee.name === 'it') {
          const firstArg = node.arguments[0];

          // Проверяем, что первый аргумент - это строка и она не содержит 🧪
          if (
            firstArg &&
            firstArg.type === 'Literal' &&
            typeof firstArg.value === 'string' &&
            !firstArg.value.includes('🧪')
          ) {
            context.report({
              node: firstArg,
              message: 'It block should include 🧪 emoji',

              /**
               *
               * @param fixer
               */
              fix(fixer) {
                // Автоматически добавляем 🧪 в начало строки
                const newText = `'🧪 ${firstArg.value}'`;
                return fixer.replaceText(firstArg, newText);
              },
            });
          }
        }
      },
    };
  },
};
