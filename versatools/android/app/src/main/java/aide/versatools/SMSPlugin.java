package aide.versatools;

import android.Manifest;
import android.content.ContentResolver;
import android.database.Cursor;
import android.net.Uri;
import android.provider.Telephony;
import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import org.json.JSONArray;
import org.json.JSONObject;

@CapacitorPlugin(name = "SMS", permissions = {@Permission(alias = "sms", strings = {Manifest.permission.READ_SMS})})
public class SMSPlugin extends Plugin {
  @PermissionCallback
  private void smsPermsCallback(PluginCall call) {
    if (getPermissionState("sms") == PermissionState.GRANTED) {
      readSMS(call);
    } else {
      JSObject result = new JSObject();
      result.put("success", false);
      result.put("message", "Permission is required to read sms");
      call.reject("Permission is required to read sms", result);
    }
  }

  @PluginMethod
  public void getInbox(PluginCall call) {

    if (getPermissionState("sms") != PermissionState.GRANTED) {
      requestPermissionForAlias("sms", call, "smsPermsCallback");
    } else {
      readSMS(call);
    }

  }

  public void readSMS(PluginCall call) {
    JSObject result = new JSObject();
    // Retrieve the timestamp parameter from the PluginCall
    long fromDateTime = call.getLong("timestamp", (long) 0); // Default to 0 if not provided
    int maxResults = call.getInt("maxresults", 10); // Default to 10 if not provided

    ContentResolver contentResolver = getContext().getContentResolver();

    if (contentResolver == null) {
      result.put("success", false);
      result.put("message", "Unable to get content resolver.");
      call.resolve(result);
      return;
    }

    Uri smsUri = Telephony.Sms.Inbox.CONTENT_URI;

    // Construct the selection criteria
    String selection = "";
    if (fromDateTime > 0) {
      selection += Telephony.Sms.DATE + " > " + fromDateTime;
    }

    String sortOrder = Telephony.Sms.DATE + " DESC";

    Cursor cursor = contentResolver.query(smsUri, null, selection, null, sortOrder);
    JSONArray smsList = new JSONArray();

    if (cursor != null && cursor.moveToFirst()) {
      int count = 0;
      do {
        JSONObject sms = new JSONObject();
        try {
          sms.put("id", cursor.getString(cursor.getColumnIndexOrThrow(Telephony.Sms._ID)));
          sms.put("sender", cursor.getString(cursor.getColumnIndexOrThrow(Telephony.Sms.ADDRESS)));
          sms.put("date", cursor.getLong(cursor.getColumnIndexOrThrow(Telephony.Sms.DATE)));
          sms.put("body", cursor.getString(cursor.getColumnIndexOrThrow(Telephony.Sms.BODY)));
        } catch (Exception e) {
          Log.e("getSms", "Unable to read sms", e);
        }
        smsList.put(sms);
        count++;
      } while (cursor.moveToNext() && count < maxResults);
      cursor.close();
    }

    result.put("success", true);
    result.put("message", "SMS retrieved successfully.");
    result.put("data", smsList);

    call.resolve(result);
  }

}
