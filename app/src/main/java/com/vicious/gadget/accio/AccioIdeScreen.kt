package com.vicious.gadget.accio

import android.annotation.SuppressLint
import android.webkit.WebView
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView

/**
 * Hosts the Accio IDE (offline JS compiler / mobile IDE) in a WebView,
 * loaded from bundled assets. Accio IDE was originally shipped as a
 * standalone index.html meant to be opened separately in a browser or
 * WebView (per the Vicious-float README) — this wires it in as a real
 * tab of the unified app instead of a disconnected file.
 */
@SuppressLint("SetJavaScriptEnabled")
@Composable
fun AccioIdeScreen() {
    AndroidView(
        modifier = Modifier.fillMaxSize(),
        factory = { context ->
            WebView(context).apply {
                settings.javaScriptEnabled = true
                settings.domStorageEnabled = true
                loadUrl("file:///android_asset/accio/index.html")
            }
        }
    )
}
