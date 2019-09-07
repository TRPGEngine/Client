package com.moonrailgun.trpg;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.umeng.message.UmengNotifyClickActivity;

import org.android.agoo.common.AgooConstants;

public class MipushActivity extends UmengNotifyClickActivity {

    private static String TAG = MipushActivity.class.getName();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // setContentView(R.layout.activity_mipush); // 这里设置不同的页面，为了区分是友盟推送进来的，还是通道推送进来的
        jumpToRNActivity(); // 跳转到react-native的activity
    }

    protected void jumpToRNActivity() {
        // Intent intent = new Intent(".MainActivity");
        Log.i(TAG, "跳转到React Native");
        Intent intent = new Intent(MipushActivity.this, MainActivity.class);
        startActivity(intent);
    }

    @Override
    public void onMessage(Intent intent) {
        super.onMessage(intent);  // 此方法必须调用，否则无法统计打开数
        String body = intent.getStringExtra(AgooConstants.MESSAGE_BODY);
        Log.i(TAG, body);
    }
}
