const cp = require('child_process');
const vscode = require('vscode');
const path = require('path');

/**
 * @param {string} filePath
 * @param {string} language
 * @returns {Promise<string>}
 */
function runCode(filePath, language, outputChannel, input = '') {
    const config = vscode.workspace.getConfiguration('cph.language');
    let runCommand;

    switch (language) {
        case 'Python':
            runCommand = config.get('python.run');
            break;
        case 'C++':
            runCommand = config.get('cpp.run');
            break;
        case 'JavaScript':
            runCommand = config.get('javascript.run');
            break;
        default:
            return Promise.reject(new Error('Unsupported language'));
    }

    const fileNameWithoutExt = path.basename(filePath, path.extname(filePath));

    if (runCommand) {
        const runCmd = runCommand.replace('$filename', filePath).replace('$fileNameWithoutExt', fileNameWithoutExt).replace('$fileNameWithoutExt', fileNameWithoutExt);
        
        return new Promise((resolve, reject) => {
            const child = cp.spawn(runCmd, {
                shell: true,
                cwd: path.dirname(filePath),
                stdio: ['pipe', 'pipe', 'pipe'],
            });
            let stdout = '';
            let stderr = '';
            child.stdout.setEncoding('utf8');
            child.stderr.setEncoding('utf8');
            child.stdout.on('data', (chunk) => { stdout += chunk; });
            child.stderr.on('data', (chunk) => { stderr += chunk; });
            child.on('error', reject);
            child.on('close', (code) => {
                if (code !== 0) {
                    outputChannel.appendLine(`Exec error: ${stderr}`);
                    reject(new Error(stderr || `Process exited with code ${code}`));
                } else {
                    resolve(stdout);
                }
            });
            child.stdin.end(input);
        });
    }

    return Promise.reject(new Error('No valid run command configured.'));
}

module.exports = { runCode };
