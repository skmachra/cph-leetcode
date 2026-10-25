const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const fetchTestCase = require("./src/fetchTestCases.js");
const { runCode } = require("./src/runCode.js");
const { compareOutputs } = require("./src/compareOutput.js");

/**
 * @param {vscode.ExtensionContext} context
 */

let outputChannel;
function activate(context) {
  console.log("Extension is activated.");
  outputChannel = vscode.window.createOutputChannel("CPH");

  let fetchTestCasesCommand = vscode.commands.registerCommand(
    "cph.fetchTestCases",
    async () => {
      const problemURL = await vscode.window.showInputBox({
        placeHolder: "Enter the LeetCode problem URL",
      });
      const workspacePath = vscode.workspace.rootPath;

      if (!workspacePath) {
        vscode.window.showErrorMessage(
          "No workspace directory found. Please open a folder in VS Code."
        );
        return;
      }
      if (problemURL) {
        if (!problemURL.includes("leetcode")) {
          vscode.window.showErrorMessage(
            "Invalid URL: The URL must be from LeetCode."
          );
          return;
        }
        try {
          const { inputArr, outputArr } = await fetchTestCase(
            problemURL,
            workspacePath,
            outputChannel
          );

          vscode.window.showInformationMessage(
            "Test cases fetched successfully!"
          );
        } catch (error) {
          vscode.window.showErrorMessage(
            `Failed to fetch test cases: ${error.message}`
          );
        }
      }
    }
  );

  let runCodeCommand = vscode.commands.registerCommand(
    "cph.runCode",
    async () => {
      outputChannel.clear();
      outputChannel.show();
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No file is currently open.");
        return;
      }
      const filePath = editor.document.fileName;
      const fileExtension = path.extname(filePath);

      let language;
      if (fileExtension === ".py") {
        language = "Python";
      } else if (fileExtension === ".cpp") {
        language = "C++";
      } else if (fileExtension === ".js") {
        language = "JavaScript";

      } else {
        vscode.window.showErrorMessage(
          "Unsupported file type. Please open a Python, C++ or JavaScript file."
        );
        return;
      }

      try {
        const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
        if (!workspacePath) {
          vscode.window.showErrorMessage("No workspace directory found. Please open a folder in VS Code.");
          return;
        }
        // Accept either testcase or testCase folder names (including older generated folders).
        const directoryName = fs.readdirSync(workspacePath, { withFileTypes: true })
          .find((entry) => entry.isDirectory() && entry.name.toLowerCase() === "testcase")?.name;
        if (!directoryName) {
          vscode.window.showErrorMessage("Could not find a testcase folder in the workspace.");
          return;
        }
        const directoryPath = path.join(workspacePath, directoryName);
        const inputFiles = fs.readdirSync(directoryPath)
          .map((name) => ({ name, match: name.match(/^input_(\d+)(?:\.txt)?$/i) }))
          .filter((file) => file.match)
          .sort((a, b) => Number(a.match[1]) - Number(b.match[1]));
        if (!inputFiles.length) {
          vscode.window.showWarningMessage("No input_N or input_N.txt files found in the testcase folder.");
          return;
        }

        outputChannel.appendLine("=== Test Case Results ===");
        let allPassed = true;
        for (const inputFile of inputFiles) {
          const number = inputFile.match[1];
          const expectedFile = fs.readdirSync(directoryPath)
            .find((name) => new RegExp(`^output_${number}(?:\\.txt)?$`, "i").test(name));
          if (!expectedFile) {
            outputChannel.appendLine(`Test Case ${number}: ⚠️ Missing output_${number}`);
            allPassed = false;
            continue;
          }
          const input = fs.readFileSync(path.join(directoryPath, inputFile.name), "utf8");
          const expectedOutput = fs.readFileSync(path.join(directoryPath, expectedFile), "utf8");
          const output = await runCode(filePath, language, outputChannel, input);
          const passed = compareOutputs(output, expectedOutput);
          outputChannel.appendLine(`Test Case ${number}: ${passed ? "✅ PASSED" : "❌ FAILED"}`);
          if (!passed) {
            allPassed = false;
            outputChannel.appendLine("Expected Output:");
            outputChannel.appendLine(expectedOutput);
            outputChannel.appendLine("Actual Output:");
            outputChannel.appendLine(output);
          }
          outputChannel.appendLine("-------------------------");
        }
        outputChannel.show();
        if (allPassed) vscode.window.showInformationMessage("All test cases passed!");
        else vscode.window.showErrorMessage("Some test cases failed. See the CPH output for details.");
      } catch (err) {
        vscode.window.showErrorMessage(`Error: ${err}`);
      }
    }
  );
  context.subscriptions.push(fetchTestCasesCommand);
  context.subscriptions.push(runCodeCommand);
}
function deactivate() {
  if (outputChannel) {
    outputChannel.dispose();
  }
}

module.exports = {
  activate,
  deactivate,
};
