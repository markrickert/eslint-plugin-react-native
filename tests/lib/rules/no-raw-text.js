/**
 * @fileoverview Detects raw text outside of Text component
 * @author Alex Zhukov
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-raw-text');
const RuleTester = require('eslint').RuleTester;

require('babel-eslint');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester();

const tests = {
  valid: [
    {
      code: `
        export default class MyComponent extends Component {
          render() {
            return (<View><Text>some text</Text></View>);
          }
        }
      `,
    },
    {
      code: `
        export default class MyComponent extends Component {
          render() {
            const text = 'some text';
            return (<View><Text>{\`\${text}\`}</Text></View>);
          }
        }
      `,
    },
    {
      code: `
        export default class MyComponent extends Component {
          render() {
            return (<View><Text>{'some text'}</Text></View>);
          }
        }
      `,
    },
    {
      code: `
        export default class MyComponent extends Component {
          render() {
            return (
              <View>
                <Text>some text</Text>
              </View>
            );
          }
        }
      `,
    },
    {
      code: `
        export default class MyComponent extends Component {
          render() {
            return (
              <Svg>
                <Text>
                  <TSpan>some text</TSpan>
                </Text>
              </Svg>
            );
          }
        }
      `,
    },
    {
      code: `
        const StyledText = styled.Text\`
          color: red;
        \`
        export default class MyComponent extends Component {
          render() {
            return (<StyledText>some text</StyledText>);
          }
        }
      `,
    },
    {
      code: `
        const Title = ({ children }) => (<Text>{children}</Text>);
        <Title>This is the title</Title>
      `,
      options: [{ skip: ['Title'] }],
    },
  ],
  invalid: [
    {
      code: `
        export default class MyComponent extends Component {
          render() {
            return (<View>some text</View>);
          }
        }
      `,
      errors: [{
        message: 'Raw text (some text) cannot be used outside of a <Text> tag',
      }],
    },
    {
      code: `
        export default class MyComponent extends Component {
          render() {
            const text = 'some text';
            return (<View>{\`\${text}\`}</View>);
          }
        }
      `,
      errors: [{
        message: 'Raw text (TemplateLiteral: text) cannot be used outside of a <Text> tag',
      }],
    },
    {
      code: `
        export default class MyComponent extends Component {
          render() {
            return (<View>{'some text'}</View>);
          }
        }
      `,
      errors: [{
        message: 'Raw text (some text) cannot be used outside of a <Text> tag',
      }],
    },
    {
      code: `
        export default class MyComponent extends Component {
          render() {
            return (<View>  </View>);
          }
        }
      `,
      errors: [{
        message: 'Whitespace(s) cannot be used outside of a <Text> tag',
      }],
    },
    {
      code: `
        const Component = ({ children }) => (<Text>{children}</Text>);
        <Component>some text</Component>
      `,
      options: [{ skip: ['Title'] }],
      errors: [{
        message: 'Raw text (some text) cannot be used outside of a <Text> tag',
      }],
    },
  ],
};

const config = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      classes: true,
      jsx: true,
    },
  },
};

tests.valid.forEach(t => Object.assign(t, config));
tests.invalid.forEach(t => Object.assign(t, config));

ruleTester.run('no-raw-text', rule, tests);
