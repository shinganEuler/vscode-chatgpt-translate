# ChatGPT Translate

A VSCode extension to translate text using ChatGPT API.

## Usage

Currently, the extension only supports translating text from the active editor selection. 

To translate the selected text, press `Ctrl+Alt+T` (Windows, Linux) or `Ctrl+Cmd+T` (macOS), and the translated text will be insert to the end of the selection. 

If you want to replace the selected text with the translated text, press `Ctrl+Alt+R` (Windows, Linux) or `Ctrl+Cmd+R` (macOS).

Attention:

Due to high latency of ChatGPT API, the result may delay for a few seconds. Please consider select a small text to translate. 

Free account may have a quota limit, consider to upgrade to a paid account to increase the quota.

As the ChatGPT API has a limit of 4096 tokens or about 1000 characters, you must not select a large text to translate. If your selected text is too large, the result will be truncated.

## Extension Settings

### `chatgpt-translate.chatgpt-api-key`

To use this extension, you need to create a OpenAi account. Then, you need to create a API key and set it to the `chatgpt-translate.chatgpt-api-key` setting.

Please follow this url to get a api key: https://platform.openai.com/account/api-keys

Attention:

ChatGPT API has a free quota of $18 when you setup account. If you exceed the quota, you will be charged for the usage. Please refer to this url for more details: https://openai.com/pricing

### `chatgpt-translate.openai-model`

Enter the OpenAI model to use for the translation. The default value is `gpt-3.5-turbo`.

Please refer to this url for more details: https://platform.openai.com/docs/models

### `chatgpt-translate.target-language`

The target language to translate the selected text. The default value is `zh-cn`.

To find the language code, please refer to this url: https://cloud.google.com/translate/docs/languages

### `chatgpt-translate.openai-url`

If your direct access to the OpenAI API is blocked, you can set a custom OpenAI API url to use. The default value is `https://api.openai.com`.

## Release Notes

### 0.0.1

Initial release of ChatGPT Translate extension.

---

Github Project

https://github.com/shinganEuler/vscode-chatgpt-translate

PRs are welcome!

**Enjoy!**
