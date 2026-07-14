package com.vicious.gadget

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.*
import com.vicious.gadget.accio.AccioIdeScreen
import com.vicious.gadget.overlay.OverlayScreen
import com.vicious.gadget.scanner.ScannerScreen
import com.vicious.gadget.scanner.ScannerViewModel

private enum class GadgetTab(val label: String) {
    SCANNER("Scanner"),
    OVERLAY("Overlay"),
    ACCIO("Accio IDE")
}

class MainActivity : ComponentActivity() {

    private val scannerVm: ScannerViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                Surface {
                    GadgetApp(scannerVm)
                }
            }
        }
    }
}

@Composable
private fun GadgetApp(scannerVm: ScannerViewModel) {
    var tab by remember { mutableStateOf(GadgetTab.SCANNER) }

    Scaffold(
        bottomBar = {
            NavigationBar {
                NavigationBarItem(
                    selected = tab == GadgetTab.SCANNER,
                    onClick = { tab = GadgetTab.SCANNER },
                    icon = { Text("\uD83D\uDD0D") },
                    label = { Text("Scanner") }
                )
                NavigationBarItem(
                    selected = tab == GadgetTab.OVERLAY,
                    onClick = { tab = GadgetTab.OVERLAY },
                    icon = { Text("\u25A0") },
                    label = { Text("Overlay") }
                )
                NavigationBarItem(
                    selected = tab == GadgetTab.ACCIO,
                    onClick = { tab = GadgetTab.ACCIO },
                    icon = { Text("\u2328") },
                    label = { Text("Accio IDE") }
                )
            }
        }
    ) { innerPadding ->
        Surface(modifier = androidx.compose.ui.Modifier.padding(innerPadding)) {
            when (tab) {
                GadgetTab.SCANNER -> ScannerScreen(scannerVm)
                GadgetTab.OVERLAY -> OverlayScreen()
                GadgetTab.ACCIO -> AccioIdeScreen()
            }
        }
    }
}
