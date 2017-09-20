import * as m from 'mithril';
import ApiModel from './ApiModel';
import * as apid from '../../../../api';

interface StreamsApiModelInterface extends ApiModel {
    init(): void;
    fetchInfos(): Promise<void>;
    getInfos(): apid.StreamInfo[];
    startRecordedHLS(recordedId: apid.RecordedId, mode: number, encodedId?: apid.EncodedId | null): Promise<number>;
    stop(streamNumber: number): Promise<void>;
    forcedStopAll(): Promise<void>;
}

/**
* StreamsApiModel
* /api/streams/info を取得
*/
class StreamsApiModel extends ApiModel implements StreamsApiModelInterface {
    private infos: apid.StreamInfo[] = [];

    public init(): void {
        super.init();
        this.infos = [];
    }

    /**
    * ストリーム情報を取得
    */
    public async fetchInfos(): Promise<void> {
        try {
            this.infos = await <any> m.request({
                method: 'GET',
                url: '/api/streams/info',
            });
        } catch(err) {
            this.infos = [];
            console.error('/api/streams/info');
            console.error(err);
            this.openSnackbar('ストリーム情報取得に失敗しました');
        }
    }

    /**
    * info を取得
    * @return apid.StreamInfo[]
    */
    public getInfos(): apid.StreamInfo[] {
        return this.infos;
    }

    /**
    * 録画済みファイルの HLS 配信を開始する
    * @param recordedId: recorded id
    * @param mode: mode
    * @param encodedId: encoded id
    * @return number stream number
    */
    public async startRecordedHLS(recordedId: apid.RecordedId, mode: number, encodedId: apid.EncodedId | null = null): Promise<number> {
        let query: { mode: number, encodedId?: number } = { mode: mode }
        if(encodedId !== null) { query.encodedId = encodedId; }

        try {
            const stream: apid.HLSStream = await <any> m.request({
                method: 'GET',
                url: `/api/streams/recorded/${ recordedId }/hls`,
                data: query,
            });

            return stream.streamNumber;
        } catch(err) {
            console.error(`/api/streams/${ recordedId }/hls`);
            console.error(query);
            console.error(err);
            this.openSnackbar('HLS 配信開始に失敗しました');
            throw err;
        }
    }

    /**
    * 指定した stream number の配信を停止する
    * @param streamNumber: number
    */
    public async stop(streamNumber: number): Promise<void> {
        try {
            await m.request({
                method: 'DELETE',
                url: `/api/streams/${ streamNumber }`,
            });
            this.openSnackbar('ストリームを停止しました');
        } catch(err) {
            console.error(`/api/streams/${ streamNumber }`);
            console.error(err);
            this.openSnackbar('ストリームの停止に失敗しました');
        }
    }

    /**
    * すべてのストリームを強制停止
    */
    public async forcedStopAll(): Promise<void> {
        try {
            await m.request({
                method: 'DELETE',
                url: '/api/streams/forcedstop',
            });
            this.openSnackbar('全てのストリーム停止しました');
        } catch(err) {
            this.infos = [];
            console.error('/api/streams/forcedstop');
            console.error(err);
            this.openSnackbar('ストリーム停止に失敗しました');
        }
    }
}

export { StreamsApiModelInterface, StreamsApiModel }
