import * as events from 'events';
import { inject, injectable } from 'inversify';
import * as apid from '../../../api';
import Recorded from '../../db/entities/Recorded';
import ILogger from '../ILogger';
import ILoggerModel from '../ILoggerModel';
import IRecordedEvent from './IRecordedEvent';

@injectable()
class RecordedEvent implements IRecordedEvent {
    private log: ILogger;
    private emitter: events.EventEmitter = new events.EventEmitter();

    constructor(@inject('ILoggerModel') logger: ILoggerModel) {
        this.log = logger.getLogger();
    }

    /**
     * 録画削除イベント発行
     * @param recorded: Recorded
     */
    public emitDeleteRecorded(recorded: Recorded): void {
        this.emitter.emit(RecordedEvent.DELETE_RECORDED_EVENT, recorded);
    }

    /**
     * video file サイズ更新イベント発行
     * @param videoFileId: apid.VideoFileId
     */
    public emitUpdateVideoFileSize(videoFileId: apid.VideoFileId): void {
        this.emitter.emit(RecordedEvent.UPDATE_VIDEO_FILE_SIZE, videoFileId);
    }

    /**
     * video file 追加イベント発行
     * @param newVideoFileId: apid.VideoFileId
     */
    public emitAddVideoFile(newVideoFileId: apid.VideoFileId): void {
        this.emitter.emit(RecordedEvent.ADD_VIDEO_FILE, newVideoFileId);
    }

    /**
     * video file 削除イベント発行
     * @param videoFileId: apid.VideoFileId
     */
    public emitDeleteVideoFile(videoFileId: apid.VideoFileId): void {
        this.emitter.emit(RecordedEvent.DLETE_VIDEO_FILE, videoFileId);
    }

    /**
     * 録画削除イベント登録
     * @param callback: (recorded: Recorded) => void
     */
    public setDeleteRecorded(callback: (recorded: Recorded) => void): void {
        this.emitter.on(RecordedEvent.DELETE_RECORDED_EVENT, async (recorded: Recorded) => {
            try {
                await callback(recorded);
            } catch (err) {
                this.log.system.error(err);
            }
        });
    }

    /**
     * video file サイズ更新イベント登録
     * @param callback: (videoFileId: apid.VideoFileId) => void
     */
    public setUpdateVideoFileSize(callback: (videoFileId: apid.VideoFileId) => void): void {
        this.emitter.on(RecordedEvent.UPDATE_VIDEO_FILE_SIZE, async (videoFileId: apid.VideoFileId) => {
            try {
                await callback(videoFileId);
            } catch (err) {
                this.log.system.error(err);
            }
        });
    }

    /**
     * video file 追加イベント登録
     * @param callback: (newVideoFileId: apid.VideoFileId) => void
     */
    public setAddVideoFile(callback: (newVideoFileId: apid.VideoFileId) => void): void {
        this.emitter.on(RecordedEvent.ADD_VIDEO_FILE, async (newVideoFileId: apid.VideoFileId) => {
            try {
                await callback(newVideoFileId);
            } catch (err) {
                this.log.system.error(err);
            }
        });
    }

    /**
     * video file 削除イベント登録
     * @param callback: (videoFileId: apid.VideoFileId) => void
     */
    public setDeleteVideoFile(callback: (videoFileId: apid.VideoFileId) => void): void {
        this.emitter.on(RecordedEvent.DLETE_VIDEO_FILE, async (videoFileId: apid.VideoFileId) => {
            try {
                await callback(videoFileId);
            } catch (err) {
                this.log.system.error(err);
            }
        });
    }
}

namespace RecordedEvent {
    export const DELETE_RECORDED_EVENT = 'DeleteRecorded';
    export const UPDATE_VIDEO_FILE_SIZE = 'UpdateVideoFileSize';
    export const ADD_VIDEO_FILE = 'AddVideoFile';
    export const DLETE_VIDEO_FILE = 'DeleteVideoFile';
}

export default RecordedEvent;