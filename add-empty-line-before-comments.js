/**
 * ESLint правило для добавления пустой строки перед комментариями, содержащими определённые ключевые слова.
 *
 * @module empty-line-before-keywords
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  /**
   * Создаёт правило.
   *
   * @param {import('eslint').Rule.RuleContext} context - Контекст правила ESLint.
   * @returns {import('eslint').Rule.RuleListener} Объект с обработчиками для анализа кода.
   */
  create(context) {
    // Ключевые слова, которые должны быть в комментариях (в нижнем регистре)
    const keywords = ['clear mock', 'act', 'assert'];

    return {
      /**
       * Обработчик для анализа всей программы.
       */
      Program() {
        // Получаем исходный код для анализа
        const sourceCode = context.getSourceCode();
        // Получаем все строки кода
        const lines = sourceCode.getLines();

        lines.forEach((line, lineIndex) => {
          if (line.trim().startsWith('//')) {
            const commentText = line.toLowerCase();

            // Проверяем, содержит ли комментарий одно из ключевых слов
            const containsKeyword = keywords.find((keyword) =>
              commentText.includes(keyword),
            );

            if (containsKeyword) {
              // Проверяем, есть ли пустая строка перед текущей строкой
              const previousLine = lines[lineIndex - 1];

              // Если предыдущая строка не пустая
              if (previousLine && previousLine.trim() !== '') {
                // Сообщаем об ошибке
                context.report({
                  /**
                   * Исправление: добавляет пустую строку перед комментарием.
                   *
                   * @param {import('eslint').Rule.RuleFixer} fixer - Объект для внесения исправлений.
                   * @returns {import('eslint').Rule.Fix} Исправление.
                   */
                  fix(fixer) {
                    // Автоматически добавляем пустую строку перед комментарием
                    return fixer.insertTextBeforeRange(
                      [
                        sourceCode.getIndexFromLoc({
                          column: 0,
                          line: lineIndex + 1,
                        }),
                        0,
                      ],
                      '\n',
                    );
                  },
                  loc: {
                    end: { column: line.length, line: lineIndex + 1 },
                    start: { column: 0, line: lineIndex + 1 },
                  },
                  message: `🤬 Перед ${
                    containsKeyword[0].toUpperCase() + containsKeyword.slice(1)
                  } должна быть пустая строка`, // Сообщение об ошибке
                  node: context.getSourceCode().ast, // Указываем узел (всё дерево)
                });
              }
            }
          }
        });
      },
    };
  },
  meta: {
    docs: {
      category: 'Stylistic Issues', // Категория — стилевые проблемы
      description:
        'Добавляет пустую строку перед комментариями, содержащими определённые ключевые слова (регистронезависимо)', // Описание правила
      recommended: false, // Не включено в рекомендованные правила ESLint
    },
    fixable: 'whitespace', // Правило может автоматически исправлять пробелы
    schema: [], // Дополнительные параметры не требуются
    type: 'layout', // Тип правила — стилевое (касается форматирования)
  },
};
