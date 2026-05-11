/**
 * ボーイスカウト杉並5団｜LINE委員会説明資料 画像挿入スクリプト
 *
 * 使い方:
 * 1. https://script.google.com/ を開く
 * 2. 「新しいプロジェクト」を作成
 * 3. このコードを貼り付けて保存
 * 4. insertExplanationImages を選択して「実行」
 * 5. Googleアカウントの権限を許可する
 */

// body の直接子要素を返す（テキスト要素から上に辿る）
function getDirectBodyChild(body, element) {
  let current = element;
  while (current !== null && current !== undefined) {
    try {
      const parent = current.getParent();
      if (parent === null || parent === undefined) return null;
      // 親が BODY_SECTION（文書本体）なら current が直接子
      if (parent.getType() === DocumentApp.ElementType.BODY_SECTION) {
        return current;
      }
      current = parent;
    } catch (e) {
      return null;
    }
  }
  return null;
}

function insertExplanationImages() {
  const DOC_ID = '1IZRGt_CxGIRdgMG8WUST7tWdajJA8EH13DORjsm-hj8';

  // 検索キーワード → DriveファイルID のマッピング
  // ※ドキュメント内に該当テキストが見つかった段落の直後に画像を挿入します
  const IMAGE_MAP = [
    {
      keyword: '現状の課題',
      fileId: '1U6dw0dc7ctM9v2MSeKYytolBs5Ieyrsm',
      label: '画像01: 現状の課題'
    },
    {
      keyword: '提案する仕組みの全体像',
      fileId: '15GJyAc-NkpXB8_SPHY7C4phxXYGVh0bA',
      label: '画像02: 仕組みの全体像'
    },
    {
      keyword: 'LINE公式アカウントでできること',
      fileId: '1vTIEwEUS-JPS2MyAw7z4851EOJlxfybN',
      label: '画像03: LINEでできること'
    },
    {
      keyword: '送り分けの仕組み',
      fileId: '1x9_GZkrf53EvqERacZGQ8Uat3iDLx595',
      label: '画像04: 送り分けの仕組み'
    },
    {
      keyword: '紹介動画',
      fileId: '1zlPi8P0T_v3UBlSqbAHQCdtDe4T6Hhqo',
      label: '画像05: 紹介動画のイメージ'
    },
    {
      keyword: '活動レポートの配信',
      fileId: '1FZ_maHA8L1CKvSf0P6BqDMRaJR7mD6hZ',
      label: '画像06: 活動レポート配信の流れ'
    },
    {
      keyword: '費用について',
      fileId: '1ajrvqSKvALR1TrISNEse2biuTE7GJT0U',
      label: '画像07: 費用について'
    },
    {
      keyword: '段階的な実施計画',
      fileId: '1rUn9RQGJtksfIJTK26sqkrbXaUESibPz',
      label: '画像08: 実施計画'
    },
    {
      keyword: '団員の皆さんへのお願い',
      fileId: '1Ahe4p5rFgbBlp79dW1ga4lCcujZX3s_1',
      label: '画像09: 団員へのお願い'
    },
    {
      keyword: 'まとめ',
      fileId: '1J0saoLtp9f4GrOXIAJKkCkkZ2uMES56V',
      label: '画像10: 全体のゴールイメージ'
    }
  ];

  const doc = DocumentApp.openById(DOC_ID);
  const body = doc.getBody();

  // 段落インデックスを収集（後から逆順に挿入するため）
  const insertions = [];

  for (const item of IMAGE_MAP) {
    const searchResult = body.findText(item.keyword);
    if (searchResult) {
      // body の直接子要素まで遡る（型チェックを使用して確実に判定）
      const directChild = getDirectBodyChild(body, searchResult.getElement());
      if (directChild === null) {
        Logger.log('✗ スキップ（body直下の要素が見つかりません）: ' + item.label);
        continue;
      }
      const index = body.getChildIndex(directChild);
      insertions.push({ index, fileId: item.fileId, label: item.label });
      Logger.log('✓ 見つかりました: ' + item.label + ' (段落インデックス: ' + index + ')');
    } else {
      Logger.log('✗ 見つかりませんでした: ' + item.keyword + ' ← ドキュメントのテキストを確認してください');
    }
  }

  if (insertions.length === 0) {
    Logger.log('エラー: 挿入対象が見つかりませんでした。ドキュメントのテキストとキーワードを確認してください。');
    return;
  }

  // 逆順にソート（前から挿入するとインデックスがずれるため後ろから処理）
  insertions.sort((a, b) => b.index - a.index);

  // 画像を挿入
  let successCount = 0;
  for (const item of insertions) {
    try {
      const file = DriveApp.getFileById(item.fileId);
      const blob = file.getBlob();
      const newPara = body.insertParagraph(item.index + 1, '');
      newPara.appendInlineImage(blob);
      newPara.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
      successCount++;
      Logger.log('✓ 挿入完了: ' + item.label);
    } catch (e) {
      Logger.log('✗ 挿入エラー: ' + item.label + ' → ' + e.message);
    }
  }

  doc.saveAndClose();
  Logger.log('');
  Logger.log('=== 完了 ===');
  Logger.log(successCount + ' / ' + insertions.length + ' 枚の画像を挿入しました。');
  Logger.log('ドキュメントを開いて確認してください: https://docs.google.com/document/d/' + DOC_ID);
}
