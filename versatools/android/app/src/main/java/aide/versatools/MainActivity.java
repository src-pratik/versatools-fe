package aide.versatools;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    registerPlugin(EchoPlugin.class);
    registerPlugin(SMSPlugin.class);
    super.onCreate(savedInstanceState);
  }
}
