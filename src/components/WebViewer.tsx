import React from 'react';
import { WebView } from 'react-native-webview';

interface WebViewProps {
  uri: string;
  incognito?: boolean;
  onNavigationStateChange?: Function;
}

export const WebViewer: React.FC<WebViewProps> = ({
  uri,
  incognito = false,
  onNavigationStateChange,
}) => {
  return (
    <WebView
      incognito={incognito}
      useWebKit={true}
      automaticallyAdjustContentInsets={false}
      javaScriptEnabled
      scalesPageToFit
      startInLoadingState
      userAgent="Mozilla/5.0 (Linux; Android 6.0.1; SM-G920V Build/MMB29K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.98 Mobile Safari/537.36 MobileApplicationWebView/0.1"
      source={{
        uri,
      }}
      onLoadStart={(e) => {
        if (onNavigationStateChange) {
          onNavigationStateChange(e)
        }
      }}
      contentInset={{ top: -1, left: -1, bottom: -1, right: -1 }}
    />
  );
};
