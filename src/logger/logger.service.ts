import { Logger } from 'tslog';
import { promises } from 'fs';
import { join } from 'path';
import { ILogWriter } from './logger.interface';

export class LoggerService {
	public logger: Logger;
	private filePath: string;
	public dataForWrite: ILogWriter;

	constructor() {
		this.logger = new Logger({
			displayInstanceName: false,
			displayLoggerName: false,
			displayFilePath: 'hidden',
			displayFunctionName: false,
			dateTimeTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		});
		this.filePath = join(__dirname, 'log.txt');
		this.dataForWrite = {
			date: '',
			info: '',
		};
	}

	// Write data in logfile
	async write(data: ILogWriter): Promise<void> {
		try {
			let dataTransform = JSON.stringify(data);
			dataTransform = `${dataTransform};\n`;
			await promises.appendFile(this.filePath, dataTransform);
		} catch (err) {
			this.logger.error(err);
		}
	}

	// Log events
	log(...args: unknown[]): ILogWriter {
		const dafaOfInfo = this.logger.info(...args);
		this.dataForWrite.date = dafaOfInfo.date.toLocaleString();
		this.dataForWrite.info = dafaOfInfo.argumentsArray[0] as string;
		return this.dataForWrite;
	}

	// Log errors
	error(...args: unknown[]): ILogWriter {
		const dataOfError = this.logger.error(...args);
		this.dataForWrite.date = dataOfError.date.toLocaleString();
		this.dataForWrite.info = dataOfError.argumentsArray[0] as string;
		this.dataForWrite.err_description = dataOfError.argumentsArray[1] as string;
		return this.dataForWrite;
	}

	// Log warnings
	warn(...args: unknown[]): void {
		this.logger.warn(...args);
	}
}
