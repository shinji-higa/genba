/* 現場管理ポータル：表示言語（日本語・スペイン語）。辞書と置き換えの仕組みは今の現場管理の写し。
   画面は日本語のまま作り、表示するときに置き換える。入力された文字は置き換えない */
    var LANG = (function() { try { return localStorage.getItem('portalLang') === 'es' ? 'es' : 'ja'; } catch (e) { return 'ja'; } })();
    var I18N_ES = {
      'ログアウト': 'Cerrar sesión', '現場選択': 'Obras', '現場選択へ': 'Obras', '戻る': 'Volver', '設定': 'Configuración',
      '現場管理システム': 'Gestión de obras',
      'ログイン / 新規登録': 'Iniciar sesión / Registrarse',
      'アカウントIDとパスワードを入力してください。': 'Ingrese su ID de cuenta y contraseña.',
      '未登録の場合はそのまま新規登録へ進みます。': 'Si no está registrado, pasará al registro.',
      '姓': 'Apellido', '名': 'Nombre', '姓名': 'Nombre completo', 'アカウントID': 'ID de cuenta', 'パスワード': 'Contraseña',
      'この端末でログインしたままにする': 'Mantener la sesión en este dispositivo',
      '新規登録・ログイン': 'Iniciar sesión / Registrarse', 'ログイン入力に戻る': 'Volver al inicio de sesión',
      '新規アカウント情報入力': 'Datos de la nueva cuenta', '新規登録を完了する': 'Completar registro',
      '未登録のアカウントです。お名前（姓・名）を入力してください。': 'Cuenta no registrada. Ingrese su apellido y nombre.',
      '姓と名を入力してください。直前のID・パスワードは引き継がれています。': 'Ingrese apellido y nombre. Se mantienen el ID y la contraseña ingresados.',
      'アカウントIDまたはメールアドレス': 'ID de cuenta o correo', '半角英数字記号（先頭0可）': 'Letras, números y símbolos',
      '照合・確認中...': 'Verificando...', '新規アカウント登録中...': 'Registrando cuenta...',
      'パスワードが正しくありません。': 'La contraseña no es correcta.',
      'アカウントIDを入力してください。': 'Ingrese su ID de cuenta.', 'パスワードを入力してください。': 'Ingrese su contraseña.',
      '姓を入力してください。': 'Ingrese su apellido.', '名を入力してください。': 'Ingrese su nombre.',
      'このアカウントIDは既に登録されています。ログインしてください。': 'Este ID de cuenta ya está registrado. Inicie sesión.',
      'ログインの有効期限が切れました。もう一度ログインしてください。': 'Su sesión expiró. Inicie sesión de nuevo.',
      '未登録のアカウントです。姓と名を入力して登録を完了してください。': 'Cuenta no registrada. Ingrese apellido y nombre para completar el registro.',
      '認証に失敗しました。': 'No se pudo verificar.', '登録に失敗しました。': 'No se pudo registrar.',
      'アカウントが存在しません。': 'La cuenta no existe.',
      // 現場一覧
      '現場新規追加': 'Agregar obra', '新規に現場を追加する場合は、EXD担当者に連絡': 'Para agregar una obra, contacte al encargado de EXD',
      '全て表示': 'Todos', '作業前': 'Antes de iniciar', '進行中': 'En curso', '完了調整中': 'Ajustes finales', '完了': 'Terminado', 'EXD管理': 'Gestión EXD',
      '着手': 'Inicio', '完成': 'Fin', '現場名で検索...': 'Buscar obra...', '再読み込み': 'Recargar',
      '現場情報を読み込んでいます...': 'Cargando obras...', '該当する現場がありません。': 'No hay obras.',
      // 現場詳細
      '現場詳細': 'Detalle', '報告': 'Informes', '写真': 'Fotos', '資料': 'Documentos', '注文': 'Pedidos', '担当': 'Personal',
      '丸ダクト注文': 'Ducto redondo', '角ダクト注文': 'Ducto rectangular', '消耗品注文': 'Consumibles', '金物注文': 'Herrajes', '準備中': 'Próximamente', '製作伝票の入力': 'Hoja de fabricación', '日報': 'Diario',
      '現場情報編集': 'Editar obra', '編集する場合は現場管理者に連絡': 'Para editar, contacte al administrador de la obra',
      'Google Chat を開く': 'Abrir Google Chat', '現場住所 (押すとGoogle地図アプリが開きます)': 'Dirección (toque para abrir Google Maps)',
      'コンビニ': 'Tienda', '駐車場': 'Estacionamiento', 'ホームセンター': 'Ferretería',
      '工期 着手': 'Inicio de obra', '工期 完成': 'Fin de obra', '工事内容': 'Trabajo a realizar',
      'EXD案件担当者 / 連絡先': 'Encargado EXD / Contacto', '現場代理人 / 連絡先': 'Residente de obra / Contacto',
      '現場担当者1 / 連絡先': 'Encargado de obra 1 / Contacto', '現場担当者2 / 連絡先': 'Encargado de obra 2 / Contacto',
      '外観画像1 なし': 'Sin foto de fachada 1', '外観画像2 なし': 'Sin foto de fachada 2', '備考': 'Observaciones',
      '未設定': 'Sin datos', '特になし': 'Nada en particular', '現場情報を読み込み中...': 'Cargando datos de la obra...',
      'この現場の最新情報を再読み込み': 'Recargar datos de la obra', '最新データを取得しています...': 'Obteniendo datos...',
      '最新情報に更新しました。': 'Datos actualizados.', '更新しました。': 'Actualizado.',
      '施工に関する注意事項': 'Precauciones de la obra', '施工ルール・注意事項': 'Reglas y precauciones',
      '駐車スペース': 'Estacionamiento', '土日祝工事': 'Trabajo en fin de semana y feriados', '喫煙ルール': 'Reglas para fumar',
      'トイレ': 'Baño', '守衛手続': 'Trámite con vigilancia',
      '未確認': 'Sin confirmar', '現場内': 'En la obra', 'コインパーキング': 'Estacionamiento pagado',
      '土日共に可': 'Sábado y domingo', '土曜のみ可': 'Solo sábado', '日曜のみ可': 'Solo domingo', '不可': 'No permitido',
      'その他': 'Otro', '喫煙スペースのみ可': 'Solo en zona de fumadores', '敷地内or仮設': 'En el terreno o portátil',
      '無し': 'No hay', '有り': 'Sí hay',
      'その他ルール（全文自動展開）': 'Otras reglas', 'その他ルール（全権限で編集可能・全文自動展開）': 'Otras reglas (todos pueden editar)',
      '編集': 'Editar', '保存': 'Guardar', '取消': 'Cancelar', '保存中...': 'Guardando...',
      // 報告
      '報告を追加する': 'Agregar informe', '打合報告': 'Reunión', '通常報告': 'Informe normal', '追加報告': 'Informe adicional', '品質安全報告': 'Calidad y seguridad',
      '新規報告入力': 'Nuevo informe', '閉じる': 'Cerrar', '報告属性': 'Tipo de informe', '報告内容': 'Contenido',
      '画像添付（写真）': 'Adjuntar foto', '写真を撮影 / 選択': 'Tomar o elegir foto', '写真の保存先フォルダ': 'Carpeta para la foto',
      '資料データ添付（PDF等）': 'Adjuntar documento (PDF, etc.)', '資料ファイルを選択': 'Elegir documento', '資料の保存先フォルダ': 'Carpeta para el documento',
      '報告を送信する': 'Enviar informe', '送信中...': 'Enviando...', '報告を送信中...': 'Enviando informe...', 'キャンセル': 'Cancelar', 'キャンセルする': 'Cancelar',
      '文字のみ': 'Solo texto', '標準グリッド': 'Cuadrícula', '拡大表示': 'Vista grande',
      '報告を読み込んでいます...': 'Cargando informes...', '報告データを読み込んでいます...': 'Cargando informes...',
      '報告を再読み込み': 'Recargar informes', '該当する報告はありません。': 'No hay informes.',
      '本日の作業内容や報告事項を入力してください': 'Escriba el trabajo de hoy o lo que quiera informar',
      '添付写真': 'Foto adjunta', '添付写真を開く': 'Abrir foto adjunta', '添付資料': 'Documento adjunto', '添付ファイル': 'Archivo adjunto',
      '-- 保存先フォルダを選択 --': '-- Elija la carpeta --', 'フォルダを読み込み中...': 'Cargando carpetas...', '写真を圧縮しています...': 'Comprimiendo foto...',
      // 写真・資料
      '写真を追加': 'Agregar fotos', '資料を追加': 'Agregar documentos', 'フォルダを追加': 'Nueva carpeta', 'フォルダ追加': 'Nueva carpeta',
      'フォルダの移動': 'Mover carpeta', 'フォルダ移動': 'Mover carpeta', '選択中のフォルダの削除': 'Eliminar carpetas seleccionadas', '選択削除': 'Eliminar selección',
      '全選択': 'Seleccionar todo', '移動': 'Mover', '削除': 'Eliminar', '削除する': 'Eliminar', '削除中...': 'Eliminando...', '選択': 'Seleccionar', '選択解除': 'Quitar selección',
      '新しい順': 'Más recientes', '古い順': 'Más antiguos', '写真TOP': 'Fotos', '資料TOP': 'Documentos',
      'タップで元の写真を表示': 'Toque para ver la foto', 'タップで選択': 'Toque para seleccionar', 'タップで資料を開く': 'Toque para abrir el documento',
      'データ名・コメント編集': 'Editar nombre y comentario', '資料名編集': 'Editar nombre', '写真を再読み込み': 'Recargar fotos', '資料を再読み込み': 'Recargar documentos',
      // コメント
      'コメント': 'Comentarios', '送信': 'Enviar', 'コメントを入力': 'Comentario...', '相手を指定（メンション）': 'Mencionar a alguien',
      '写真へのコメント': 'Comentarios de la foto', '資料へのコメント': 'Comentarios del documento', '報告へのコメント': 'Comentarios del informe',
      'まだコメントはありません。': 'Aún no hay comentarios.', 'ここから未読': 'No leídos desde aquí','最初のコメントを送ってみましょう。': 'Envíe el primer comentario.',
      'このコメントを削除しますか？': '¿Eliminar este comentario?', 'コメントを削除しました。': 'Comentario eliminado.',
      // 担当
      '担当者一覧を読み込んでいます...': 'Cargando personal...', '担当者一覧を再読み込み': 'Recargar personal', '登録者が存在しません。': 'No hay personal registrado.',
      '編集を完了': 'Terminar edición',
      // お知らせ
      'お知らせ通知': 'Avisos', 'すべて': 'Todos', '未読': 'No leídos', '既読済': 'Leídos', '並び順': 'Orden', '年月日順': 'Por fecha',
      '現場別': 'Por obra', '通知者': 'Autor', '全員': 'Todos', 'すべて既読にする': 'Marcar todo como leído',
      'お知らせを読み込んでいます...': 'Cargando avisos...', 'お知らせを更新しています...': 'Actualizando avisos...', 'お知らせを再読み込み': 'Recargar avisos',
      'お知らせはありません。': 'No hay avisos.', '未読のお知らせはありません。': 'No hay avisos sin leer.', '既読済のお知らせはありません。': 'No hay avisos leídos.',
      '@あなた': '@ti', '現場を開く': 'Abrir obra',
      'この端末は、まだ通知（音付き）を受け取る設定になっていません。': 'Este dispositivo aún no recibe notificaciones (con sonido).',
      'この端末で通知を受け取る': 'Recibir notificaciones en este dispositivo',
      'この開き方では端末への通知は使えません。ホーム画面のアイコン、またはPCアプリ「現場管理」から開いてください。': 'Al abrir así no funcionan las notificaciones. Ábrala desde el ícono de la pantalla de inicio o la app de PC.',
      // 設定
      'お知らせ通知設定': 'Configuración de avisos', 'この端末の通知の状態を確認しています...': 'Revisando las notificaciones de este dispositivo...',
      'この端末の通知を止める': 'Desactivar en este dispositivo', 'テスト通知を送る': 'Enviar notificación de prueba',
      '通知の音は、スマホ・PCの通知音が鳴ります（マナーモードや端末の通知設定に従います）。': 'Suena el tono de notificación del celular o PC (según el modo silencio y la configuración del dispositivo).',
      '通知する内容': 'Qué notificar', 'お知らせを通知する（全体）': 'Notificar avisos (todo)',
      '報告の追加・編集': 'Informes nuevos o editados', '写真の追加・編集': 'Fotos nuevas o editadas', '資料の追加・編集': 'Documentos nuevos o editados', '現場情報の追加・編集': 'Datos de obra nuevos o editados',
      '通知する現場': 'Obras a notificar', '読み込んでいます...': 'Cargando...',
      'オフにした内容・現場は端末に通知しません（お知らせ一覧には表示されます）。自分が行った操作は通知されません。': 'Lo desactivado no se notifica al dispositivo (sí aparece en la lista de avisos). Sus propias acciones no se notifican.',
      'お知らせ通知設定を保存': 'Guardar configuración de avisos', 'アカウント設定': 'Cuenta',
      'パスワード（変更するときだけ、新しいパスワードを入力）': 'Contraseña (solo si desea cambiarla)', 'googleアカウント': 'Cuenta de Google', '会社名': 'Empresa',
      '現在のパスワード（本人確認のため必須）': 'Contraseña actual (obligatoria)', 'ログインに使うのは「アカウントID」と「パスワード」だけです。': 'Para iniciar sesión solo se usan el ID de cuenta y la contraseña.',
      'アカウント設定を保存': 'Guardar cuenta', '変更しない場合は空欄のまま': 'Déjelo vacío si no lo cambia',
      '表示言語': 'Idioma', '担当している現場がありません。': 'No tiene obras asignadas.',
      '通知がブロックされています。端末（ブラウザ）の設定で、このアプリの通知を「許可」にしてください。': 'Las notificaciones están bloqueadas. Permítalas en la configuración del dispositivo (navegador).',
      // 現場の入力画面（主に管理者）
      '基本情報': 'Información básica', '現場を削除': 'Eliminar obra', '現場名': 'Nombre de la obra', '現場住所': 'Dirección de la obra', '案件フロー': 'Estado',
      '工期': 'Plazo de obra', '未定': 'Por definir', '担当者情報': 'Responsables', 'EXD案件担当者': 'Encargado EXD', '連絡先': 'Contacto',
      '現場代理人': 'Residente de obra', '現場担当者1': 'Encargado de obra 1', '現場担当者2': 'Encargado de obra 2',
      '外観画像': 'Fotos de fachada', '外観画像1': 'Foto de fachada 1', '外観画像2': 'Foto de fachada 2', '写真を撮影 / 端末から選択': 'Tomar foto / Elegir del dispositivo',
      'この内容で現場を登録': 'Registrar obra', 'この内容で現場情報を編集する': 'Guardar cambios', 'この現場を複製する': 'Duplicar esta obra',
      'キャンセルして現場選択へ戻る': 'Cancelar y volver', '未定（タップして選択）': 'Por definir (toque para elegir)',
      '工事内容を記入': 'Escriba el trabajo', '現場独自ルール等を記入': 'Escriba las reglas propias de la obra', '補足事項等': 'Notas adicionales',
      '今日': 'Hoy', '前の月': 'Mes anterior', '次の月': 'Mes siguiente',
      '日': 'Do', '月': 'Lu', '火': 'Ma', '水': 'Mi', '木': 'Ju', '金': 'Vi', '土': 'Sá',
      '日報機能は準備中です。': 'El parte diario aún no está disponible.',
      // 日報
      '今月の集計': 'Resumen del mes', '日報入力': 'Registro del día', 'この月の日報': 'Registros del mes', '日付': 'Fecha', '区分': 'Tipo',
      '出勤': 'Trabajó', '欠勤': 'Falta', '有給': 'Vacaciones', '出勤時刻': 'Entrada', '退勤時刻': 'Salida', '夜勤（休憩なし）': 'Turno noche (sin descanso)',
      '現場': 'Obra', '現場名を入力して「追加」': 'Escriba la obra y toque Agregar', '追加': 'Agregar', '保存しました ✓': 'Guardado ✓', '日報': 'Registro diario', 'メモ': 'Nota', '作業内容など（任意）': 'Trabajo realizado, etc. (opcional)', 'この内容で保存': 'Guardar',
      '平日': 'Laborable', '所定休日': 'Sábado', '法定休日': 'Domingo/feriado', '実働': 'Trabajado', '時間外': 'Horas extra', '早退': 'Faltan',
      '夜勤': 'Turno noche', '出勤日数': 'Días trabajados', '所定休日出勤日数': 'Días en sábado', '所定休日時間外': 'Horas extra en sábado',
      '法定休日出勤日数': 'Días en domingo/feriado', '法定休日時間外': 'Horas extra en domingo/feriado', '早退時間': 'Horas faltantes',
      '欠勤日': 'Faltas', '有給日数': 'Vacaciones', '平日数': 'Días laborables', '未入力': 'Sin registro',
      '出勤日数から1日引かれます': 'Se descuenta 1 día de los días trabajados', '欠勤には数えません': 'No cuenta como falta',
      'この日の日報を削除しますか？': '¿Eliminar el registro de este día?', '日報を再読み込み': 'Recargar', '前回の現場': 'Obra anterior',
      '日報を読み込んでいます...': 'Cargando...', '※ 金額はこの画面には表示しません。': '* Los montos no se muestran en esta pantalla.',
      '日報を保存しました。': 'Registro guardado.', '日報を削除しました。': 'Registro eliminado.', '日報を使う権限がありません。': 'No tiene permiso para usar el registro diario.',
      // 体調チェック
      '体調チェックを始める前に': 'Antes de empezar el control de salud', '同意して始める': 'Aceptar y empezar',
      '記録した血圧・体調・症状は、現場での事故やけがを防ぐために使います。': 'La presión, el estado y los síntomas que registre se usan para prevenir accidentes en la obra.',
      '記録を見られるのは、あなたと、マスター、あなたの担当現場の現場管理者だけです。': 'Solo pueden verlos usted, el administrador general y el administrador de su obra.',
      '「要確認」「作業不可」になったときは、その人たちに通知が届きます。': 'Si sale "Revisar" o "No trabajar", se les avisa a ellos.',
      '新しいフォルダを作って追加': 'Crear carpeta nueva y agregar', 'ダウンロード': 'Descargar', 'ダウンロードフォルダに追加しました': 'Agregado a la carpeta de descargas', '保存の準備をしています...': 'Preparando...', '保存の準備ができました': 'Listo para guardar', '保存する': 'Guardar',
      '「保存する」を押すと共有メニューが開きます。': 'Al tocar "Guardar" se abre el menú Compartir.', '・写真アプリに入れる：「画像を保存」': '- Para Fotos: "Guardar imagen"',
      '・保存先を選ぶ：「“ファイル”に保存」': '- Para elegir carpeta: "Guardar en Archivos"', '共有メニューを開けませんでした。': 'No se pudo abrir el menú Compartir.',
      'ホーム画面のアイコンを作り直すと使えるようになる場合があります。': 'Puede funcionar si vuelve a crear el ícono de la pantalla de inicio.', 'DL': 'Bajar', 'ZIPにまとめています...': 'Creando ZIP...', 'ダウンロードの準備をしています...': 'Preparando la descarga...',
      'ZIPファイルの準備ができました': 'El archivo ZIP está listo', 'ダウンロードの準備ができました': 'La descarga está lista',
      '体調': 'Salud', '体調を開く': 'Abrir salud', '今日の体調チェックがまだです': 'Aún no registra su salud de hoy', '体調チェック': 'Control de salud',
      '自分の記録': 'Mis registros', 'みんなの体調': 'Salud del equipo', '今朝の体調チェック': 'Control de salud de esta mañana',
      '測り方': 'Cómo medir',
      '起きてから1時間以内（トイレの後、朝食と薬の前）': 'Dentro de 1 hora después de levantarse (después de ir al baño, antes del desayuno y de la medicina)',
      '座って1〜2分休んでから測る': 'Siéntese y descanse 1 o 2 minutos antes de medir', 'できれば2回測って、2回とも入力する': 'Si puede, mida 2 veces e ingrese ambas',
      '測定時刻': 'Hora de la medición', '時': 'Hora', '分': 'Minuto',
      '血圧・脈拍（1回目）': 'Presión y pulso (1.ª vez)', '血圧・脈拍（2回目）': 'Presión y pulso (2.ª vez)',
      '上（最高）': 'Alta', '下（最低）': 'Baja', '脈拍（任意）': 'Pulso (opcional)', '2回目も入力する': 'Ingresar 2.ª medición', 'やめる': 'Quitar',
      '睡眠': 'Sueño', '今日の体調': 'Cómo se siente hoy', '朝食': 'Desayuno', '前日の飲酒': 'Alcohol ayer', 'いつもの薬': 'Su medicina habitual',
      '前日の疲れ': 'Cansancio de ayer', '尿の色': 'Color de la orina', '夏の項目（熱中症対策）': 'Preguntas de verano (golpe de calor)',
      'よく眠れた': 'Dormí bien', '普通': 'Normal', '眠れていない': 'Dormí mal', '良い': 'Bien', '悪い': 'Mal', '食べた': 'Sí comí', '食べていない': 'No comí',
      'なし': 'Nada', '適量': 'Poco', '多め': 'Mucho', '飲んだ': 'La tomé', '飲み忘れ': 'Olvidé tomarla', '服薬なし': 'No tomo medicina',
      '残っていない': 'Nada cansado', '少し残っている': 'Algo cansado', 'かなり残っている': 'Muy cansado', '薄い': 'Clara', '濃い': 'Oscura',
      '気になる症状（あてはまるものを全部）': 'Síntomas (marque todos los que tenga)', '気になる症状': 'Síntomas',
      '頭痛': 'Dolor de cabeza', 'めまい': 'Mareo', '動悸': 'Palpitaciones', '胸の痛み': 'Dolor de pecho', '息苦しさ': 'Falta de aire', '発熱': 'Fiebre',
      'だるさ': 'Cansancio', '吐き気': 'Náuseas', '腰や関節の痛み': 'Dolor de espalda o articulaciones',
      '気になることがあれば（任意）': 'Si algo le preocupa (opcional)', '記録する': 'Registrar', 'この内容で書き直す': 'Guardar cambios',
      '最近の記録': 'Registros recientes', '体調記録を再読み込み': 'Recargar', 'みんなの体調を再読み込み': 'Recargar', '前の日': 'Día anterior', '次の日': 'Día siguiente',
      '通常': 'Normal', '要確認': 'Revisar', '作業不可': 'No trabajar',
      '問題ありません。今日も安全に作業しましょう。': 'Todo bien. Trabaje con seguridad hoy.',
      '職長（現場の責任者）に伝えてください。高所作業・重機の作業は見合わせてください。': 'Avise a su jefe de cuadrilla. No haga trabajos en altura ni con maquinaria pesada.',
      '今日は作業をしないでください。職長に連絡し、早めに医療機関を受診してください。': 'Hoy no trabaje. Avise a su jefe de cuadrilla y vaya al médico pronto.',
      '胸の痛み・息苦しさが強いときは、すぐに119番に電話してください。': 'Si el dolor de pecho o la falta de aire son fuertes, llame al 119 de inmediato.',
      '測定': 'medido', '血圧': 'Presión', '脈拍': 'Pulso', '確認済み': 'Revisado', '修正する': 'Corregir',
      'まだ記録はありません。': 'Aún no hay registros.', 'まだ入力していない項目があります：': 'Faltan datos: ', '血圧（上・下）': 'Presión (alta y baja)',
      '体調記録を読み込んでいます...': 'Cargando...', '体調記録を読み込めませんでした。': 'No se pudieron cargar los registros.',
      'みんなの体調を読み込んでいます...': 'Cargando...', '読み込めませんでした。': 'No se pudo cargar.', '保存できませんでした。': 'No se pudo guardar.',
      '対象の人がいません。': 'No hay personas.', '本人に確認した': 'Ya hablé con la persona', '最近の記録を見る': 'Ver registros recientes',
      '本人確認ができませんでした。もう一度ログインしてください。': 'No se pudo verificar su identidad. Inicie sesión de nuevo.',
      '体調が悪い': 'Se siente mal', '薬の飲み忘れ': 'Olvidó su medicina', '疲れが残っている': 'Sigue cansado', '尿の色が濃い': 'Orina oscura',
      '自動翻訳': 'Traducción automática', 'リンク:': 'Enlaces:', '原文': 'Ver original', '原文を隠す': 'Ocultar original', '翻訳を見る': 'Ver traducción', '翻訳を隠す': 'Ocultar traducción'
    };
    var I18N_MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'set', 'oct', 'nov', 'dic'];
    var I18N_ES_RE = [
      [/^(\d+)件$/, '$1'],
      [/^(\d+)件選択中$/, '$1 seleccionados'],
      [/^▼ 以前のお知らせを表示（残り(\d+)件）$/, '▼ Ver avisos anteriores ($1 más)'],
      [/^(\d{4})年(\d{1,2})月(\d{1,2})日$/, '$3/$2/$1'],
      [/^(\d{4})年(\d{1,2})月$/, '$2/$1'],
      [/^(\d{4})年$/, '$1'],
      [/^(\d{1,2})月$/, function(m, n) { return I18N_MONTHS[(+n - 1) % 12] || m; }],
      [/^(.+)　現場詳細$/, '$1 · Detalle'],
      [/^(.+)　情報編集$/, '$1 · Editar'],
      [/^💬 コメント(.*)$/, '💬 Comentarios$1'],
      [/^通信エラー: ([\s\S]*)$/, 'Error de conexión: $1'],
      [/^選択中: (.*)$/, 'Seleccionado: $1'],
      [/^元報告日: (.*)$/, 'Fecha original: $1'],
      [/^(.*)に削除しました$/, 'Eliminado: $1'],
      [/^例: (.*)$/, 'Ej.: $1'],
      [/^例 (\d+)$/, 'Ej. $1'],
      [/^血圧が高い（(.+)）$/, 'Presión alta ($1)'],
      [/^血圧が高め（(.+)）$/, 'Presión algo alta ($1)'],
      [/^血圧が低い（(.+)）$/, 'Presión baja ($1)'],
      [/^脈拍が少ない（(.+)）$/, 'Pulso bajo ($1)'],
      [/^脈拍が多い（(.+)）$/, 'Pulso alto ($1)'],
      [/^(現場代理人|現場担当者1|現場担当者2) (会社名|姓名|連絡先)$/, function(m, a, b) { return I18N_ES[a] + ': ' + I18N_ES[b].toLowerCase(); }],
      [/^連絡先 (\d+)$/, 'Contacto $1'],
      [/^このフォルダ直下には(写真|資料)がありません（サブフォルダを選択してください）。$/, function(m, k) { return 'No hay ' + (k === '写真' ? 'fotos' : 'documentos') + ' en esta carpeta (elija una subcarpeta).'; }],
      [/^(写真|資料)がありません。「(写真|資料)を追加」から保存してください。$/, function(m, k) { return k === '写真' ? 'No hay fotos. Use "Agregar fotos".' : 'No hay documentos. Use "Agregar documentos".'; }]
    ];
    // 先頭の記号（＋ ← ✕ 📌 など）は残して、その後ろの言葉を訳す
    var I18N_LEAD = /^([^0-9A-Za-z぀-ヿ㐀-鿿「（(]+)/;
    var I18N_JP = /[぀-ヿ㐀-鿿]/;
    var I18N_SKIP_SEL = '[data-i18n-skip], .cm-list, script, style, textarea, #userEmail';
    var I18N_ATTR_SKIP_SEL = '[data-i18n-skip], .cm-list';   // 入力欄の中身は訳さないが、案内（placeholder）は訳す
    var i18nBusy = false, i18nHasEs = false;
    var i18nText = new WeakMap();   // 文字の元の日本語 { ja, out }
    var i18nAttr = new WeakMap();   // 属性の元の日本語 { placeholder: { ja, out }, ... }

    function i18nLookup(s) {
      if (Object.prototype.hasOwnProperty.call(I18N_ES, s)) return I18N_ES[s];
      for (var i = 0; i < I18N_ES_RE.length; i++) {
        var r = I18N_ES_RE[i];
        if (r[0].test(s)) return s.replace(r[0], r[1]);
      }
      return null;
    }
    // 日本語 → 今の言語（見つからなければ null）
    function i18nTranslate(ja) {
      var s = String(ja);
      var core = s.trim();
      if (!core || !I18N_JP.test(core)) return null;
      var pre = s.slice(0, s.indexOf(core)), post = s.slice(s.indexOf(core) + core.length);
      var hit = i18nLookup(core);
      if (hit == null) {
        var lead = core.match(I18N_LEAD);
        if (lead) {
          var rest = core.slice(lead[1].length);
          var h2 = i18nLookup(rest);
          if (h2 != null) hit = lead[1] + h2;
        }
      }
      return hit == null ? null : pre + hit + post;
    }
    // プログラムの中で使う：T('保存') → 'Guardar'
    function T(ja) {
      if (LANG !== 'es') return ja;
      var t = i18nTranslate(ja);
      return t == null ? ja : t;
    }

    function i18nSkip(el) {
      return !el || (el.closest && el.closest(I18N_SKIP_SEL));
    }
    function i18nDoText(n) {
      var el = n.parentNode;
      if (!el || el.nodeType !== 1 || i18nSkip(el)) return;
      var cur = n.nodeValue, rec = i18nText.get(n);
      var ja = (rec && cur === rec.out) ? rec.ja : cur;
      var out = ja;
      if (LANG === 'es') {
        var t = i18nTranslate(ja);
        if (t != null) out = t;
      }
      if (out !== cur) n.nodeValue = out;
      if (out !== ja) i18nText.set(n, { ja: ja, out: out }); else i18nText.delete(n);
    }
    function i18nDoAttrs(el) {
      ['placeholder', 'title', 'aria-label'].forEach(function(a) {
        if (!el.hasAttribute(a)) return;
        var map = i18nAttr.get(el) || {};
        var cur = el.getAttribute(a), rec = map[a];
        var ja = (rec && cur === rec.out) ? rec.ja : cur;
        var out = ja;
        if (LANG === 'es') { var t = i18nTranslate(ja); if (t != null) out = t; }
        if (out !== cur) el.setAttribute(a, out);
        map[a] = { ja: ja, out: out };
        i18nAttr.set(el, map);
      });
    }
    function i18nApply(root) {
      if (!root) return;
      i18nBusy = true;
      try {
        if (root.nodeType === 3) { i18nDoText(root); return; }
        if (root.nodeType !== 1) return;
        if (!(root.closest && root.closest(I18N_ATTR_SKIP_SEL))) {
          i18nDoAttrs(root);
          root.querySelectorAll('[placeholder],[title],[aria-label]').forEach(function(el) { if (!el.closest(I18N_ATTR_SKIP_SEL)) i18nDoAttrs(el); });
        }
        if (i18nSkip(root)) return;
        var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), n, list = [];
        while ((n = w.nextNode())) list.push(n);
        list.forEach(i18nDoText);
      } finally {
        i18nBusy = false;
      }
    }

/* ---------- ここからポータルで増えた文 ---------- */
Object.assign(I18N_ES, {
  '現場管理ポータル': 'Portal de obras', 'ログイン': 'Iniciar sesión', 'メールアドレス': 'Correo electrónico',
  'メールアドレスとパスワードを入力してください。': 'Ingrese su correo y contraseña.',
  '初めての方・パスワードを忘れた方': 'Primera vez / Olvidé mi contraseña', '確認しています…': 'Verificando...',
  'ログインできませんでした。': 'No se pudo iniciar sesión.', '先にメールアドレスを入れてください。': 'Primero ingrese su correo.',
  'メールを送れませんでした。': 'No se pudo enviar el correo.', 'メールアドレスかパスワードが違います。': 'El correo o la contraseña no son correctos.',
  '回数が多すぎます。少し待ってからもう一度お試しください。': 'Demasiados intentos. Espere un poco e intente de nuevo.',
  'メールアドレスの形が正しくありません。': 'El formato del correo no es correcto.', 'サーバーでエラーが発生しました。': 'Ocurrió un error en el servidor.',
  '権限がありません': 'Sin permiso', '権限がありません。': 'No tiene permiso.', '送れませんでした': 'No se pudo enviar', '電波なし': 'Sin señal', '未送信': 'No enviado',
  '送れなかったもの': 'No enviados', '（押すと詳しく）': '(toque para ver)', '電波がありません。': 'No hay señal.',
  '前に見た内容を表示しています。最新ではないことがあります。': 'Se muestra lo visto antes. Puede no estar actualizado.',
  '未送信（電波が戻ったら自動で送ります）：': 'No enviados (se enviarán al volver la señal):', '送れなかったもの：': 'No enviados:',
  '確認した': 'Entendido', '新しいVerがあります（押すと入れ替え）': 'Hay una nueva versión (toque para actualizar)', '入れ替えています…': 'Actualizando...',
  '一般作業員': 'Trabajador', '現場管理者': 'Encargado de obra', '担当なし': 'Sin asignar', '[変更中]': '[Cambiando]',
  'この現場は見られません。': 'No puede ver esta obra.', '公衆トイレ': 'Baño público', '注意事項': 'Precauciones', '施工に関する注意事項を更新': 'Precauciones de la obra actualizadas',
  'コメントの削除': 'Eliminar comentario', 'コメントは2000文字以内で入力してください。': 'El comentario debe tener hasta 2000 caracteres.', 'コメントは1000文字以内で入力してください。': 'El comentario debe tener hasta 1000 caracteres.',
  '読み込めませんでした（電波がないか、権限がありません）。': 'No se pudo cargar (sin señal o sin permiso).', '変更された権限はありません。': 'No hay cambios de permisos.', '担当の変更': 'Cambio de asignación',
  '保存先フォルダ': 'Carpeta de destino', '前へ': 'Anterior', '次へ': 'Siguiente', '縮小': 'Reducir', '拡大': 'Ampliar', 'ドライブで開く': 'Abrir en Drive',
  '電波がないため、この写真は表示できません。': 'Sin señal no se puede mostrar esta foto.', '電波のある所で一度開くと、次からは電波がなくても見られます。': 'Si la abre una vez con señal, luego podrá verla sin señal.',
  '写真を表示できませんでした。': 'No se pudo mostrar la foto.', 'まだ送信していません。送信が終わると開けます。': 'Aún no se ha enviado. Podrá abrirla al terminar el envío.',
  '電波がないため、この資料は開けません。': 'Sin señal no se puede abrir este documento.', 'この形式の資料は、画面の中では開けません。': 'Este formato no se puede abrir en pantalla.',
  '右上の「保存」から開いてください。': 'Ábralo con "Guardar" arriba a la derecha.', '資料を読み込んでいます…': 'Cargando documento...', '資料を開けませんでした。': 'No se pudo abrir el documento.',
  'PDFを表示する部品を読み込めませんでした。電波のある所で一度開いてください。': 'No se pudo cargar el visor de PDF. Ábralo una vez con señal.',
  'TOPには直接追加できません。保存先を選んでください': 'No se puede agregar directamente en TOP. Elija una carpeta', '移動先のフォルダを選んでください': 'Elija la carpeta de destino',
  '名前を入力してください:': 'Ingrese el nombre:', 'コメントを入力してください:': 'Ingrese el comentario:', '削除できるのは、マスター・現場管理者、または自分が追加したものだけです。': 'Solo puede eliminar el Maestro, el encargado o quien lo agregó.',
  'テスト現場を開いてください。': 'Abra una obra de prueba.', '登録済（送信待ち）': 'Registrado (esperando envío)', '画像を確認': 'Ver imagen', '伝票': 'Comprobante', '角ダクト': 'Ducto rectangular', '注文書': 'Pedido', '丸ダクト': 'Ducto redondo',
  '注文書の入力': 'Ingresar pedido', '注文ログ': 'Registro de pedidos', '作成': 'Crear', '題名を入れてください。': 'Ingrese un título.', 'ダクト仕様': 'Especificación de ducto', '保存先フォルダを選んでください。': 'Elija la carpeta de destino.',
  '工場へ提出は、電波のある所で行ってください。': 'Envíe a la fábrica en un lugar con señal.', '工場へ提出は、電波のある所で行ってください。入力した内容は保存されています。': 'Envíe a la fábrica en un lugar con señal. Lo ingresado está guardado.',
  '電波がないため開けません。電波のある所で一度開くと、次からは電波がなくても見られます。': 'Sin señal no se puede abrir. Si lo abre una vez con señal, luego podrá verlo sin señal.', '一覧から開き直してください。': 'Ábralo de nuevo desde la lista.',
  '提出': 'Enviar', '出勤日': 'Día laboral', '日報の削除': 'Eliminar parte diario', '時間': 'horas', '退勤が出勤より前になっています（夜勤のときは「夜勤」にチェックしてください）。': 'La salida es anterior a la entrada (si es turno de noche, marque "Turno de noche").',
  '体調記録の同意': 'Consentimiento de salud', '血圧（上）': 'Presión (alta)', '血圧（下）': 'Presión (baja)', '2回目の血圧（上）': '2.ª presión (alta)', '2回目の血圧（下）': '2.ª presión (baja)', '2回目の脈拍': '2.º pulso',
  '血圧の上と下が逆になっていないか確認してください。': 'Verifique que la presión alta y baja no estén invertidas.', '2回目の血圧は、上と下の両方を入力してください。': 'Ingrese ambas presiones de la 2.ª medición.',
  '2回目の血圧の上と下が逆になっていないか確認してください。': 'Verifique que la 2.ª presión alta y baja no estén invertidas.', '2回目の脈拍だけを入力することはできません。': 'No se puede ingresar solo el 2.º pulso.', '体調の確認': 'Revisión de salud', 'お知らせ': 'Aviso',
  'この端末（ブラウザ）は通知に対応していません。': 'Este dispositivo (navegador) no admite notificaciones.', 'iPhone・iPadは、ホーム画面に追加したアイコンから開くと通知を受け取れます。': 'En iPhone/iPad, abra desde el icono agregado a la pantalla de inicio para recibir notificaciones.',
  '✅ この端末で通知を受け取ります（アプリを閉じていても届きます）': '✅ Este dispositivo recibe notificaciones (aun con la app cerrada)', 'この端末は、まだ通知を受け取る設定になっていません。': 'Este dispositivo aún no está configurado para recibir notificaciones.',
  '設定しています…': 'Configurando...', '通知が許可されませんでした。': 'No se permitieron las notificaciones.', 'この端末で通知を受け取れるようになりました。': 'Este dispositivo ya puede recibir notificaciones.', 'この端末の通知を止めました。': 'Se detuvieron las notificaciones de este dispositivo.',
  'テスト通知を送っています…': 'Enviando notificación de prueba...', 'お返事がありません。少し待っても届かないときは、もう一度押してください。': 'Sin respuesta. Si no llega, toque de nuevo.', '送れませんでした。「この端末の通知を止める」を押してから、もう一度設定してください。': 'No se pudo enviar. Toque "Detener notificaciones" y configure de nuevo.',
  '読み込んでいます…': 'Cargando...', '📱 アプリの版': '📱 Versión de la app', '今の版：': 'Versión actual: ', '最新の版にする': 'Actualizar a la última versión', '新しい版が出ているときは、押すと入れ替わります。': 'Si hay una versión nueva, se actualizará al tocar.',
  '担当の現場はありません。': 'No tiene obras asignadas.', 'オフにした内容・現場は端末に通知しません（お知らせ一覧には表示されます）。自分が行った操作は通知されません。@で指定されたコメントと体調の知らせは、設定に関係なく届きます。': 'Lo desactivado no se notifica (sí aparece en Avisos). Sus propias acciones no se notifican. Los comentarios con @ y los avisos de salud siempre llegan.',
  '名前': 'Nombre', 'グループ（マスターが決めます）': 'Grupo (lo define el Maestro)', '携帯番号（伝票・注文書の注文者の欄に出ます）': 'Celular (aparece en comprobantes y pedidos)', 'パスワードを変える（メールでご案内します）': 'Cambiar contraseña (por correo)',
  '人の管理': 'Gestión de personas', '通知設定': 'Notificaciones', '保存しました。': 'Guardado.', '現場情報': 'Datos de la obra', '＋ 人を追加': '+ Agregar persona',
  'この端末で通知を受け取る': 'Recibir notificaciones aquí', 'この端末の通知を止める': 'Detener notificaciones', 'テスト通知を送る': 'Enviar notificación de prueba', '🌐 表示言語': '🌐 Idioma'
});
var I18N_DOW = { '日': 'dom', '月': 'lun', '火': 'mar', '水': 'mié', '木': 'jue', '金': 'vie', '土': 'sáb' };
Object.assign(I18N_ES, {
  '元日': 'Año Nuevo', '成人の日': 'Día de la Mayoría de Edad', '建国記念の日': 'Día de la Fundación', '天皇誕生日': 'Cumpleaños del Emperador', '春分の日': 'Equinoccio de primavera',
  '昭和の日': 'Día de Showa', '憲法記念日': 'Día de la Constitución', 'みどりの日': 'Día de la Naturaleza', 'こどもの日': 'Día de los Niños', '海の日': 'Día del Mar', '山の日': 'Día de la Montaña',
  '敬老の日': 'Día del Respeto a los Mayores', '秋分の日': 'Equinoccio de otoño', 'スポーツの日': 'Día del Deporte', '文化の日': 'Día de la Cultura', '勤労感謝の日': 'Día del Trabajo', '国民の休日': 'Feriado nacional', '振替休日': 'Feriado compensatorio'
});
I18N_ES_RE.unshift(
  [/^\(([日月火水木金土])\)$/, function(m, d) { return '(' + I18N_DOW[d] + ')'; }],
  [/^(\d{1,2})月(\d{1,2})日\(([日月火水木金土])\)$/, function(m, a, b, d) { return b + '/' + a + ' (' + I18N_DOW[d] + ')'; }],
  [/^(\d+\/\d+) · 脈拍 (\d+)$/, '$1 · Pulso $2'],
  [/^(.+、.+)$/, function(m) { return m.split('、').map(function(p) { var h = i18nLookup(p); return h == null ? p : h; }).join(', '); }],
  [/^(?:(.+)　)?(最新を表示|端末の控えを表示|表示)：([\d.]+)秒(?:（開いてから ([\d.]+)秒）)?$/, function(m, a, b, c) { return (a ? a + ' · ' : '') + (b === '最新を表示' ? 'Actualizado' : b === '表示' ? 'Mostrado' : 'Copia local') + ': ' + c + ' s'; }],
  [/^(.+) あてに、パスワードを決めるメールを送りました。届かないときは迷惑メールも見てください。$/, 'Se envió un correo a $1 para definir la contraseña. Si no llega, revise el correo no deseado.'],
  [/^(.+) へ、パスワードを変えるメールを送りました。$/, 'Se envió a $1 un correo para cambiar la contraseña.'],
  [/^(\d+)台の端末にテスト通知を送りました。$/, 'Notificación de prueba enviada a $1 dispositivo(s).'],
  [/^読み込めませんでした：([\s\S]*)$/, 'No se pudo cargar: $1'],
  [/^保存できませんでした：([\s\S]*)$/, 'No se pudo guardar: $1'],
  [/^送れませんでした：([\s\S]*)$/, 'No se pudo enviar: $1'],
  [/^設定できませんでした：([\s\S]*)$/, 'No se pudo configurar: $1'],
  [/^(.+)を削除します。よろしいですか？$/, 'Se eliminará: $1. ¿Continuar?'],
  [/^新しいフォルダ名を入力してください（(.*)の中に作ります）:$/, 'Nombre de la carpeta nueva (dentro de $1):'],
  [/^(.+)へのコメント$/, 'Comentarios'],
  [/^📄 (.+)を開く$/, '📄 Abrir $1'],
  [/^(電波なし|未送信 \d+件|送れなかったもの \d+件)/, function(m, k, o, s) { return s.replace('電波なし', 'Sin señal').replace(/未送信 (\d+)件/, 'No enviados: $1').replace(/送れなかったもの (\d+)件/, 'Fallidos: $1').replace('（押すと詳しく）', ' (toque para ver)'); }],
  [/^(.+)の数字を確認してください（(.+)）$/, 'Revise el número de $1 ($2)']
);

function i18nStart() {
  if (LANG === 'es') i18nHasEs = true;
  document.documentElement.lang = LANG;
  i18nApply(document.body);
  new MutationObserver(function(muts) {
    if (i18nBusy || (LANG === 'ja' && !i18nHasEs)) return;
    muts.forEach(function(m) {
      if (m.type === 'characterData') i18nApply(m.target);
      else if (m.type === 'attributes') { if (!(m.target.closest && m.target.closest(I18N_ATTR_SKIP_SEL))) { i18nBusy = true; try { i18nDoAttrs(m.target); } finally { i18nBusy = false; } } }
      else m.addedNodes.forEach(function(n) { i18nApply(n); });
    });
  }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['placeholder', 'title', 'aria-label'] });
  updateLangButtons();
}
function updateLangButtons() {
  document.querySelectorAll('[data-lang-btn]').forEach(function(b) {
    b.classList.toggle('active', b.getAttribute('data-lang-btn') === LANG);
  });
}
/** 言語を変える。入力された文の表示は、次に画面を開いたときに変わる */
function setLang(lang) {
  lang = (lang === 'es') ? 'es' : 'ja';
  if (lang === 'es') i18nHasEs = true;
  LANG = lang;
  try { localStorage.setItem('portalLang', lang); } catch (e) {}
  document.documentElement.lang = lang;
  i18nApply(document.body);
  updateLangButtons();
}
/* ブラウザの確認の窓も訳す */
(function() {
  ['alert', 'confirm', 'prompt'].forEach(function(k) {
    var f = window[k];
    window[k] = function(m, d) { return f.call(window, T(String(m)), d); };
  });
})();
window.portalLang = function() { return LANG; };