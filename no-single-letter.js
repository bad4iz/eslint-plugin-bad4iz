// @ts-check
/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  /**
   * Она должна вернуть объект с обратными вызовами. Эти вызовы будет совершаться при обходе AST нашего исходного кода.
   *
   * @param {*} context - Context.
   * @returns {*}
   */
  create(context) {
    return {
      /**
       * Identifier.
       *
       * @param {*} node - Node.
       * @returns {void}
       */
      Identifier: function (node) {
        if (node.name.length === 1 && node.name !== '_')
          context.report({
            message: '💩 Избегайте однобуквенных идентификаторов !!!',
            node,
          });
      },
    };
  },
};
