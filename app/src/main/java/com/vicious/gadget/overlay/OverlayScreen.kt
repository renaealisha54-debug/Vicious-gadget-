package com.vicious.gadget.overlay

import android.content.Intent
import android.net.Uri
import android.provider.Settings
import android.widget.Toast
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/**
 * Compose screen for controlling the ViciousLayer system overlay.
 * Replaces the original Activity + activity_main.xml UI (those layout
 * resources were referenced in the original Vicious-float upload but
 * never actually included in it, so this is a working rebuild rather
 * than a straight port).
 */
@Composable
fun OverlayScreen() {
    val context = LocalContext.current
    var isRunning by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text("ViciousLayer Overlay", fontWeight = FontWeight.Bold, fontSize = 20.sp)
        Spacer(Modifier.height(8.dp))
        Text(if (isRunning) "Status: running" else "Status: stopped")
        Spacer(Modifier.height(24.dp))

        Button(onClick = {
            if (!Settings.canDrawOverlays(context)) {
                val intent = Intent(
                    Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                    Uri.parse("package:${context.packageName}")
                )
                context.startActivity(intent)
                Toast.makeText(context, "Grant overlay permission, then tap Start again.", Toast.LENGTH_LONG).show()
            } else {
                context.startService(Intent(context, ViciousOverlayService::class.java))
                isRunning = true
                Toast.makeText(context, "Overlay active.", Toast.LENGTH_SHORT).show()
            }
        }) {
            Text("Start Overlay")
        }

        Spacer(Modifier.height(12.dp))

        OutlinedButton(onClick = {
            context.stopService(Intent(context, ViciousOverlayService::class.java))
            isRunning = false
            Toast.makeText(context, "Overlay stopped.", Toast.LENGTH_SHORT).show()
        }) {
            Text("Stop Overlay")
        }
    }
}
