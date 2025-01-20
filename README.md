# VS Code Extension: CPH LeetCode

## Overview

This VS Code extension allows users to fetch test cases for LeetCode problems directly from their VS Code environment. It also provides a feature to run the test cases against your code and get feedback. The extension automates the process of extracting input and output test cases from LeetCode problem pages and provides an easy-to-use interface for fetching and running test cases.

### Features

- **Fetch Test Cases**: Automatically retrieves test cases (input and output) from a given LeetCode problem URL.
- **Run Test Cases**: Allows users to run the fetched test cases against their code and shows the results.
- **Organized Test Case Files**: Saves the fetched test cases in a folder named `testCase` within the project directory.

## Requirements

- **Node.js** (v12.x or later)
- **VS Code** (v1.60 or later)

## Installation

### Installing from the Marketplace

1. Open **VS Code**.
2. Navigate to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window.
3. Search for **"Competitive Programming Helper: Leetcode (CPH)"**.
4. Click **Install**.

Alternatively, you can download the extension directly from the [Marketplace](https://marketplace.visualstudio.com/items?itemName=Sunilkumar.cph).


### Manually Install

1. Clone or download this repository:
   ```bash
   git clone https://github.com/skmachra/cph-leetcode.git
   cd cph-leetcode
2. Install dependencies:
   ```bash
   npm install
2. Open the project folder in VS Code.
3. Press `F5` to launch the extension in a new Extension Development Host window.

## Usage

### Fetch Test Cases

1. Open a LeetCode problem URL in your VS Code editor.
2. From the Command Palette (`Ctrl + Shift + P`), run the `CPH: Fetch Test Cases` command.
3. Enter the LeetCode problem URL in the input prompt.
4. Wait for the extension to fetch the test cases and save them in the `testCase` folder.

### Run Test Cases

1. Once the test cases are fetched, you can run them against your code by running the `CPH: Run Test Cases` command from the Command Palette.
2. The extension will execute your code and compare its output with the expected results.

### Test Case Folder

The test cases will be saved in a `testCase` folder in your workspace directory. The folder will contain input/output files:


## File Description:

- **Input Files**: Each `input_X.txt` file contains the input values for the corresponding test case.
- **Output Files**: Each `output_X.txt` file contains the expected output for the corresponding test case.

## Commands

- **CPH: Fetch Test Cases**: Prompts the user for a LeetCode problem URL, fetches the test cases, and saves them in the `testCase` folder.
- **CPH: Run Test Cases**: Runs the fetched test cases against the user's code and shows the results.

## Keybindings and Menus

### Keybindings:

- **Ctrl + Alt + F** (Windows/Linux) / **Cmd + Alt + F** (Mac): Fetch Test Cases.
- **Ctrl + Alt + R** (Windows/Linux) / **Cmd + Alt + R** (Mac): Run Test Cases.

These keybindings are available when the editor window is focused.

### Menus:

The **CPH: Fetch Test Cases** and **CPH: Run Test Cases** commands are also available in the **editor context menu** when the file is a supported language (C++, Python, or JavaScript).

### Demo Video

Watch the demo video below to see how the **Competitive Programming Helper: Leetcode (CPH)** extension works:

<video width="720" height="480" controls>
  <source src="./video.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>


## Configuration

The extension supports the following settings to customize the fetch and run behavior:

```json
"cph.language.cpp.run": "g++ -o $fileNameWithoutExt $filename && .\\$fileNameWithoutExt",
"cph.language.python.run": "py $filename",
"cph.language.javascript.run": "node $filename"
