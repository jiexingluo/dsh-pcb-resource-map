/** Locale-owned PCB Resource Map controls and file-validation feedback. */
const en = {
  'title': 'PCB Resource Map',
  'controls': 'PCB Resource Map controls',
  'zoomOut': 'Zoom out',
  'zoomIn': 'Zoom in',
  'actual': 'Actual size',
  'fit': 'Fit window',
  'percent': '{value}%',
  'counts': '{nets} networks · {relays} relays',
  'static': 'Static SVG · no interactive markers',
  'unavailable': '{count} relays have no unique state pair',
  'invalid': 'Cannot preview this PCB Resource Map. Check that it is a complete UTF-8 SVG with valid dimensions.',
  'failed': 'Could not initialize the viewer. Reload the file to retry.',
} as const

const zh = {
  'title': 'PCB Resource Map',
  'controls': 'PCB 资源映射控件',
  'zoomOut': '缩小',
  'zoomIn': '放大',
  'actual': '实际大小',
  'fit': '适应窗口',
  'percent': '{value}%',
  'counts': '{nets} 个网络 · {relays} 个继电器',
  'static': '静态 SVG · 无交互标记',
  'unavailable': '{count} 个继电器无法唯一配对状态',
  'invalid': '无法预览资源映射，请检查文件是否为完整的 UTF-8 SVG，且尺寸有效',
  'failed': '查看器初始化失败，请重新加载文件',
} as const

const ja = {
  'title': 'PCB Resource Map',
  'controls': 'リソースマップ操作',
  'zoomOut': '縮小',
  'zoomIn': '拡大',
  'actual': '実際のサイズ',
  'fit': 'ウィンドウに合わせる',
  'percent': '{value}%',
  'counts': 'ネットワーク {nets} · リレー {relays}',
  'static': '静的 SVG · 対話マーカーなし',
  'unavailable': '{count} 個のリレーに一意の状態ペアがありません',
  'invalid': '有効なサイズの完全な UTF-8 SVG を指定してください。',
  'failed': 'ビューアを初期化できません。再読み込みしてください。',
} as const

const es = {
  'title': 'PCB Resource Map',
  'controls': 'Controles del mapa',
  'zoomOut': 'Alejar',
  'zoomIn': 'Acercar',
  'actual': 'Tamaño real',
  'fit': 'Ajustar ventana',
  'percent': '{value}%',
  'counts': '{nets} redes · {relays} relés',
  'static': 'SVG estático · sin marcadores interactivos',
  'unavailable': '{count} relés sin par de estados único',
  'invalid': 'Se requiere un SVG UTF-8 completo con dimensiones válidas.',
  'failed': 'No se pudo iniciar el visor. Vuelva a cargar el archivo.',
} as const

const fr = {
  'title': 'PCB Resource Map',
  'controls': 'Commandes de la carte',
  'zoomOut': 'Réduire',
  'zoomIn': 'Agrandir',
  'actual': 'Taille réelle',
  'fit': 'Ajuster à la fenêtre',
  'percent': '{value}%',
  'counts': '{nets} réseaux · {relays} relais',
  'static': 'SVG statique · sans marqueurs interactifs',
  'unavailable': '{count} relais sans paire unique',
  'invalid': 'Un SVG UTF-8 complet avec des dimensions valides est requis.',
  'failed': 'Impossible de démarrer la visionneuse. Rechargez le fichier.',
} as const

const de = {
  'title': 'PCB Resource Map',
  'controls': 'Steuerung des Ressourcenplans',
  'zoomOut': 'Verkleinern',
  'zoomIn': 'Vergrößern',
  'actual': 'Originalgröße',
  'fit': 'Fenster anpassen',
  'percent': '{value}%',
  'counts': '{nets} Netze · {relays} Relais',
  'static': 'Statisches SVG · keine interaktiven Markierungen',
  'unavailable': '{count} Relais ohne eindeutiges Zustandspaar',
  'invalid': 'Eine vollständige UTF-8-SVG-Datei mit gültigen Abmessungen ist erforderlich.',
  'failed': 'Die Vorschau konnte nicht gestartet werden. Laden Sie die Datei erneut.',
} as const

const ru = {
  'title': 'PCB Resource Map',
  'controls': 'Управление картой',
  'zoomOut': 'Уменьшить',
  'zoomIn': 'Увеличить',
  'actual': 'Исходный размер',
  'fit': 'По размеру окна',
  'percent': '{value}%',
  'counts': 'Сетей: {nets} · Реле: {relays}',
  'static': 'Статический SVG · нет интерактивных меток',
  'unavailable': 'Нет однозначной пары состояний у {count} реле',
  'invalid': 'Требуется полный SVG в UTF-8 с допустимыми размерами.',
  'failed': 'Не удалось открыть просмотр. Перезагрузите файл.',
} as const

const pt = {
  'title': 'PCB Resource Map',
  'controls': 'Controlos do mapa',
  'zoomOut': 'Reduzir',
  'zoomIn': 'Ampliar',
  'actual': 'Tamanho real',
  'fit': 'Ajustar à janela',
  'percent': '{value}%',
  'counts': '{nets} redes · {relays} relés',
  'static': 'SVG estático · sem marcadores interativos',
  'unavailable': '{count} relés sem par de estados único',
  'invalid': 'É necessário um SVG UTF-8 completo com dimensões válidas.',
  'failed': 'Não foi possível iniciar o visualizador. Recarregue o ficheiro.',
} as const

/** Dictionaries registered together for the PCB Resource Map browser plugin. */
export const dictionaries = { en, zh, ja, es, fr, de, ru, pt }

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** PCB Resource Map preview controls and status. */
    resourceMap: keyof typeof en
  }
}
