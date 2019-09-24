package com.moonrailgun.trpg;

import android.widget.Toast;
import android.app.Activity;
import android.app.Application;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;

import java.util.Map;
import java.util.HashMap;
import java.util.Random;

public class TRPGModule extends ReactContextBaseJavaModule {
  public static final String LOG_TAG = "TRPGModule";// all logging should use this tag
  private static final String DURATION_SHORT_KEY = "SHORT";
  private static final String DURATION_LONG_KEY = "LONG";
  private final Random mRandomNumberGenerator = new Random(System.currentTimeMillis());
  private ReactApplicationContext context;
  private TRPGNotificationHelper mTRPGNotificationHelper;

  private Activity curActivity = null;
  private Activity getCurActivity() {
    Activity activity = getCurrentActivity();
    if(activity != null) {
      curActivity = activity;
    }

    return activity;
  }

  public TRPGModule(ReactApplicationContext reactContext) {
    super(reactContext);
    context = reactContext;

    Application applicationContext = (Application) reactContext.getApplicationContext();
    mTRPGNotificationHelper = new TRPGNotificationHelper(applicationContext);
  }

  @Override
  public String getName() {
    return "TRPGModule";
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
    constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
    return constants;
  }

  @ReactMethod
  public void show(String message, int duration) {
    Toast.makeText(getReactApplicationContext(), message, duration).show();
  }

  @ReactMethod
  public void sendBasicNotify(ReadableMap details) {
    Bundle bundle = Arguments.toBundle(details);
    // If notification ID is not provided by the user, generate one at random
    if (bundle.getString("id") == null) {
        bundle.putString("id", String.valueOf(mRandomNumberGenerator.nextInt()));
    }
    mTRPGNotificationHelper.sendToNotificationCentre(bundle);
  }
}
