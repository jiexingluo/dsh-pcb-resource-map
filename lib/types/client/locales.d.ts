/** Locale-owned PCB Resource Map controls and file-validation feedback. */
declare const en: {
    readonly title: "PCB Resource Map";
    readonly controls: "PCB Resource Map controls";
    readonly zoomOut: "Zoom out";
    readonly zoomIn: "Zoom in";
    readonly actual: "Actual size";
    readonly fit: "Fit window";
    readonly percent: "{value}%";
    readonly counts: "{nets} networks · {relays} relays";
    readonly static: "Static SVG · no interactive markers";
    readonly unavailable: "{count} relays have no unique state pair";
    readonly invalid: "Cannot preview this PCB Resource Map. Check that it is a complete UTF-8 SVG with valid dimensions.";
    readonly failed: "Could not initialize the viewer. Reload the file to retry.";
};
/** Dictionaries registered together for the PCB Resource Map browser plugin. */
export declare const dictionaries: {
    en: {
        readonly title: "PCB Resource Map";
        readonly controls: "PCB Resource Map controls";
        readonly zoomOut: "Zoom out";
        readonly zoomIn: "Zoom in";
        readonly actual: "Actual size";
        readonly fit: "Fit window";
        readonly percent: "{value}%";
        readonly counts: "{nets} networks · {relays} relays";
        readonly static: "Static SVG · no interactive markers";
        readonly unavailable: "{count} relays have no unique state pair";
        readonly invalid: "Cannot preview this PCB Resource Map. Check that it is a complete UTF-8 SVG with valid dimensions.";
        readonly failed: "Could not initialize the viewer. Reload the file to retry.";
    };
    zh: {
        readonly title: "PCB Resource Map";
        readonly controls: "PCB 资源映射控件";
        readonly zoomOut: "缩小";
        readonly zoomIn: "放大";
        readonly actual: "实际大小";
        readonly fit: "适应窗口";
        readonly percent: "{value}%";
        readonly counts: "{nets} 个网络 · {relays} 个继电器";
        readonly static: "静态 SVG · 无交互标记";
        readonly unavailable: "{count} 个继电器无法唯一配对状态";
        readonly invalid: "无法预览资源映射，请检查文件是否为完整的 UTF-8 SVG，且尺寸有效";
        readonly failed: "查看器初始化失败，请重新加载文件";
    };
    ja: {
        readonly title: "PCB Resource Map";
        readonly controls: "リソースマップ操作";
        readonly zoomOut: "縮小";
        readonly zoomIn: "拡大";
        readonly actual: "実際のサイズ";
        readonly fit: "ウィンドウに合わせる";
        readonly percent: "{value}%";
        readonly counts: "ネットワーク {nets} · リレー {relays}";
        readonly static: "静的 SVG · 対話マーカーなし";
        readonly unavailable: "{count} 個のリレーに一意の状態ペアがありません";
        readonly invalid: "有効なサイズの完全な UTF-8 SVG を指定してください。";
        readonly failed: "ビューアを初期化できません。再読み込みしてください。";
    };
    es: {
        readonly title: "PCB Resource Map";
        readonly controls: "Controles del mapa";
        readonly zoomOut: "Alejar";
        readonly zoomIn: "Acercar";
        readonly actual: "Tamaño real";
        readonly fit: "Ajustar ventana";
        readonly percent: "{value}%";
        readonly counts: "{nets} redes · {relays} relés";
        readonly static: "SVG estático · sin marcadores interactivos";
        readonly unavailable: "{count} relés sin par de estados único";
        readonly invalid: "Se requiere un SVG UTF-8 completo con dimensiones válidas.";
        readonly failed: "No se pudo iniciar el visor. Vuelva a cargar el archivo.";
    };
    fr: {
        readonly title: "PCB Resource Map";
        readonly controls: "Commandes de la carte";
        readonly zoomOut: "Réduire";
        readonly zoomIn: "Agrandir";
        readonly actual: "Taille réelle";
        readonly fit: "Ajuster à la fenêtre";
        readonly percent: "{value}%";
        readonly counts: "{nets} réseaux · {relays} relais";
        readonly static: "SVG statique · sans marqueurs interactifs";
        readonly unavailable: "{count} relais sans paire unique";
        readonly invalid: "Un SVG UTF-8 complet avec des dimensions valides est requis.";
        readonly failed: "Impossible de démarrer la visionneuse. Rechargez le fichier.";
    };
    de: {
        readonly title: "PCB Resource Map";
        readonly controls: "Steuerung des Ressourcenplans";
        readonly zoomOut: "Verkleinern";
        readonly zoomIn: "Vergrößern";
        readonly actual: "Originalgröße";
        readonly fit: "Fenster anpassen";
        readonly percent: "{value}%";
        readonly counts: "{nets} Netze · {relays} Relais";
        readonly static: "Statisches SVG · keine interaktiven Markierungen";
        readonly unavailable: "{count} Relais ohne eindeutiges Zustandspaar";
        readonly invalid: "Eine vollständige UTF-8-SVG-Datei mit gültigen Abmessungen ist erforderlich.";
        readonly failed: "Die Vorschau konnte nicht gestartet werden. Laden Sie die Datei erneut.";
    };
    ru: {
        readonly title: "PCB Resource Map";
        readonly controls: "Управление картой";
        readonly zoomOut: "Уменьшить";
        readonly zoomIn: "Увеличить";
        readonly actual: "Исходный размер";
        readonly fit: "По размеру окна";
        readonly percent: "{value}%";
        readonly counts: "Сетей: {nets} · Реле: {relays}";
        readonly static: "Статический SVG · нет интерактивных меток";
        readonly unavailable: "Нет однозначной пары состояний у {count} реле";
        readonly invalid: "Требуется полный SVG в UTF-8 с допустимыми размерами.";
        readonly failed: "Не удалось открыть просмотр. Перезагрузите файл.";
    };
    pt: {
        readonly title: "PCB Resource Map";
        readonly controls: "Controlos do mapa";
        readonly zoomOut: "Reduzir";
        readonly zoomIn: "Ampliar";
        readonly actual: "Tamanho real";
        readonly fit: "Ajustar à janela";
        readonly percent: "{value}%";
        readonly counts: "{nets} redes · {relays} relés";
        readonly static: "SVG estático · sem marcadores interativos";
        readonly unavailable: "{count} relés sem par de estados único";
        readonly invalid: "É necessário um SVG UTF-8 completo com dimensões válidas.";
        readonly failed: "Não foi possível iniciar o visualizador. Recarregue o ficheiro.";
    };
};
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** PCB Resource Map preview controls and status. */
        resourceMap: keyof typeof en;
    }
}
export {};
