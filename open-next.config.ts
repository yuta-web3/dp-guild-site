import { defineCloudflareConfig } from '@opennextjs/cloudflare';

// 時間で作り直すページ（ISR）を使わないので、保存場所（R2）の設定は置かない
export default defineCloudflareConfig({});
