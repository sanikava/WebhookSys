(async () => {
const chalk = (await import('chalk')).default;
const inquirer = (await import('inquirer')).default;
const ora = (await import('ora')).default;
const YouTube = require('youtube-sr').default;
const play = require('play-sound')();
const Table = require('cli-table3');
const cfonts = require('cfonts');
const { exec } = require('child_process');
const fs = require('fs');

const centerText = (text) => {
    const width = process.stdout.columns;
    const padding = Math.floor((width - text.length) / 2);
    return ' '.repeat(padding > 0 ? padding : 0) + text;
};

class MusicPlayer {
    constructor() {
        this.playerProcess = null; // To hold the current playback process
        this.queue = [];
        this.currentSong = null;
    }

    async search() {
        console.clear();
        const { query } = await inquirer.prompt({
            type: 'input',
            name: 'query',
            message: 'Search for a song:'
        });

        const spinner = ora('Searching...').start();
        try {
            const results = await YouTube.search(query, { limit: 10 });
            spinner.succeed('Search complete!');

            const table = new Table({
                head: [chalk.cyan('ID'), chalk.cyan('Title'), chalk.cyan('Artist')],
                colAligns: ['center', 'left', 'left'],
                style: { 'padding-left': 1, 'padding-right': 1, head: ['cyan'] }
            });

            results.forEach((result, i) => {
                table.push([i + 1, result.title, result.channel.name]);
            });
            console.log("\n" + table.toString() + "\n");


            const { choice } = await inquirer.prompt({
                type: 'input',
                name: 'choice',
                message: 'Enter the ID of the song to add to the queue (or type "back"):',
                validate: input => {
                    if (input.toLowerCase() === 'back') return true;
                    const num = Number(input);
                    return num > 0 && num <= results.length ? true : 'Invalid ID';
                }
            });

            if (choice.toLowerCase() !== 'back') {
                const song = results[Number(choice) - 1];
                this.queue.push(song);
                console.log(chalk.green(centerText(`Added "${song.title}" to the queue.`)));
                if (!this.currentSong) {
                    this.playNext();
                }
            }
        } catch (error) {
            spinner.fail('Search failed.');
            console.error(chalk.red(error));
        }
    }

    async playNext() {
        if (this.playerProcess) {
            this.playerProcess.kill(); // Stop current song if playing
        }

        if (this.queue.length > 0) {
            this.currentSong = this.queue.shift();
            console.log(chalk.blue(centerText(`Now playing: "${this.currentSong.title}"`)));

            const spinner = ora('Downloading audio...').start();
            const tempFilePath = `./${this.currentSong.id}.mp3`; // Temporary file path

            try {
                await new Promise((resolve, reject) => {
                    exec(`yt-dlp -x --audio-format mp3 -o "${tempFilePath}" "${this.currentSong.url}"`, (error, stdout, stderr) => {
                        if (error) {
                            reject(error);
                            return;
                        }
                        resolve();
                    });
                });

                spinner.succeed('Audio downloaded.');

                this.playerProcess = play.play(tempFilePath, (err) => {
                    if (err) {
                        console.error(chalk.red(`Error playing song: ${err}`));
                    }
                    this.playerProcess = null;
                    fs.unlink(tempFilePath, (err) => { // Clean up temporary file
                        if (err) console.error(chalk.red(`Error deleting temporary file: ${err}`));
                    });
                    this.playNext(); // Play next song when current one finishes
                });
            } catch (error) {
                spinner.fail('Failed to download audio.');
                console.error(chalk.red(`Error with yt-dlp: ${error.message}`));
                this.playerProcess = null;
                this.playNext(); // Try to play next song if current one fails
            }
        } else {
            this.currentSong = null;
            console.log(chalk.yellow(centerText('Queue is empty.')));
        }
    }

    async showQueue() {
        console.clear();
        if (this.queue.length === 0) {
            console.log(chalk.yellow(centerText('The queue is empty.')));
            return;
        }

        const table = new Table({
            head: [chalk.cyan('Position'), chalk.cyan('Title')],
            colAligns: ['center', 'left'],
            style: { 'padding-left': 1, 'padding-right': 1, head: ['cyan'] }
        });

        this.queue.forEach((song, i) => {
            table.push([i + 1, song.title]);
        });

        console.log("\n" + table.toString() + "\n");
    }

    async controls() {
        console.clear();
        const { action } = await inquirer.prompt({
            type: 'list',
            name: 'action',
            message: 'Playback controls:',
            choices: [
                { name: 'Stop', value: 'stop' },
                { name: 'Next', value: 'next' },
                new inquirer.Separator(),
                { name: 'Back to main menu', value: 'back' }
            ]
        });

        switch (action) {
            case 'stop':
                if (this.playerProcess) {
                    this.playerProcess.kill();
                    this.playerProcess = null;
                    this.currentSong = null;
                    console.log(chalk.red(centerText('Stopped.')));
                }
                break;
            case 'next':
                this.playNext();
                break;
        }
    }

    async start() {
        console.clear();
        cfonts.say('Music CLI', {
            font: 'block',
            align: 'center',
            colors: ['magenta', 'cyan'],
            background: 'transparent',
            space: true,
            maxLength: '0',
            gradient: ['magenta', 'cyan'],
            independentGradient: false,
            transitionGradient: false,
            env: 'node'
        });
        console.log("\n"); // Add space
        while (true) {
            const { action } = await inquirer.prompt({
                type: 'list',
                name: 'action',
                message: 'What do you want to do?',
                choices: [
                    { name: 'Search for a song', value: 'search' },
                    { name: 'View queue', value: 'queue' },
                    { name: 'Playback controls', value: 'controls' },
                    new inquirer.Separator(),
                    { name: 'Exit', value: 'exit' }
                ]
            });

            switch (action) {
                case 'search':
                    await this.search();
                    break;
                case 'queue':
                    await this.showQueue();
                    break;
                case 'controls':
                    await this.controls();
                    break;
                case 'exit':
                    console.clear();
                    if (this.playerProcess) {
                        this.playerProcess.kill();
                    }
                    cfonts.say('Goodbye!', {
                        font: 'block',
                        align: 'center',
                        colors: ['magenta', 'cyan'],
                        background: 'transparent',
                        space: true,
                        maxLength: '0',
                        gradient: ['magenta', 'cyan'],
                        independentGradient: false,
                        transitionGradient: false,
                        env: 'node'
                    });
                    return;
            }
        }
    }
}

const musicPlayer = new MusicPlayer();
musicPlayer.start();
})();