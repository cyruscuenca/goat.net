#include <node.h>
#include <v8.h>
#include <time.h>
#include <iostream>
#include <fstream>
#include <Windows.h>
#pragma comment(lib, "user32.lib")
using std::fstream;
HHOOK keyboard_hook;
HHOOK mouse_hook;
using namespace v8;
DWORD lastTimestamp;
int i;

const clock_t begin_time = clock();

using namespace std;

void UpdateKeyState(BYTE *keystate, int keycode) {
    keystate[keycode] = GetKeyState(keycode);
}

LRESULT CALLBACK KeyboardProc(int nCode, WPARAM wParam, LPARAM lParam) {
    // Get key info
    KBDLLHOOKSTRUCT cKey = *((KBDLLHOOKSTRUCT*)lParam);

    wchar_t buffer[5];

    // Get keyboard state
    BYTE keyboard_state[256];
    GetKeyboardState(keyboard_state);
    UpdateKeyState(keyboard_state, VK_SHIFT);
    UpdateKeyState(keyboard_state, VK_CAPITAL);
    UpdateKeyState(keyboard_state, VK_CONTROL);
    UpdateKeyState(keyboard_state, VK_MENU);

    // Get keyboard layout
    HKL keyboard_layout = GetKeyboardLayout(0);

    // Get the name
    char lpszName[0x100] = {0};

    DWORD dwMsg = 1;
    dwMsg += cKey.scanCode << 16;
    dwMsg += cKey.flags << 16;

    int keyName = GetKeyNameText(dwMsg, (LPTSTR)lpszName, 255);
    // Try to convert key info
    int result = ToUnicodeEx(cKey.vkCode, cKey.scanCode, keyboard_state, buffer, 4, 0, keyboard_layout);
    // Convet to string(strings are NULL terminated)
    buffer[4] = L'\0';

    if(wParam == WM_KEYDOWN) {
        DWORD timestamp = GetTickCount();
        //qDebug() << "Key:" << cKey.vkCode << " " << QString::fromUtf16((ushort*)buffer) << " " << QString::fromUtf16((ushort*)lpszName) << " " << timestamp - lastTimestamp;
        ofstream log;
        log.open("c:/web/sites/goat.net/logs/log.csv", std::ios_base::app);
        log << cKey.vkCode << "," << "1" << "," << timestamp - lastTimestamp << endl;
        cout << cKey.vkCode << "," << "1" << "," << timestamp - lastTimestamp << endl;
        log.flush();
        log.close();
        lastTimestamp = timestamp;
    }

    if(wParam == WM_KEYUP) {
        DWORD timestamp = GetTickCount();
        //qDebug() << "Key:" << cKey.vkCode << " " << QString::fromUtf16((ushort*)buffer) << " " << QString::fromUtf16((ushort*)lpszName) << " " << timestamp - lastTimestamp;
        ofstream log;
        log.open("c:/web/sites/goat.net/logs/log.csv", std::ios_base::app);
        log << cKey.vkCode << "," << "0" << "," << timestamp - lastTimestamp << endl;
        cout << cKey.vkCode << "," << "0" << "," << timestamp - lastTimestamp << endl;
        log.flush();
        log.close();
        lastTimestamp = timestamp;
    }

    return CallNextHookEx(keyboard_hook, nCode, wParam, lParam);
}

LRESULT CALLBACK MouseProc( int code, WPARAM wParam, LPARAM lParam ) {
    // Skip processing if the code is less than zero.
    // See "Return Value" at the MSDN URL above.
    if( code < 0 )
        return CallNextHookEx( mouse_hook, code, wParam, lParam );

    if( wParam  == WM_LBUTTONDOWN) {
        DWORD timestamp = GetTickCount();
        //qDebug() << "Key:" << cKey.vkCode << " " << QString::fromUtf16((ushort*)buffer) << " " << QString::fromUtf16((ushort*)lpszName) << " " << timestamp - lastTimestamp;
        ofstream log;
        log.open("c:/web/sites/goat.net/logs/log.csv", std::ios_base::app);
        log << "a" << "," << "0" << "," << timestamp - lastTimestamp << endl;
        cout << "a" << "," << "0" << "," << timestamp - lastTimestamp << endl;
        log.flush();
        log.close();
        lastTimestamp = timestamp;
    }
    if( wParam  == WM_LBUTTONUP) {
        DWORD timestamp = GetTickCount();
        //qDebug() << "Key:" << cKey.vkCode << " " << QString::fromUtf16((ushort*)buffer) << " " << QString::fromUtf16((ushort*)lpszName) << " " << timestamp - lastTimestamp;
        ofstream log;
        log.open("c:/web/sites/goat.net/logs/log.csv", std::ios_base::app);
        log << "b" << "," << "0" << "," << timestamp - lastTimestamp << endl;
        log.flush();
        log.close();
        lastTimestamp = timestamp;
    }

    if( wParam  == WM_RBUTTONDOWN) {
        DWORD timestamp = GetTickCount();
        //qDebug() << "Key:" << cKey.vkCode << " " << QString::fromUtf16((ushort*)buffer) << " " << QString::fromUtf16((ushort*)lpszName) << " " << timestamp - lastTimestamp;
        ofstream log;
        log.open("c:/web/sites/goat.net/logs/log.csv", std::ios_base::app);
        log << "c" << "," << "0" << "," << timestamp - lastTimestamp << endl;
        log.flush();
        log.close();
        lastTimestamp = timestamp;
    }
    if( wParam  == WM_RBUTTONUP) {
        DWORD timestamp = GetTickCount();
        //qDebug() << "Key:" << cKey.vkCode << " " << QString::fromUtf16((ushort*)buffer) << " " << QString::fromUtf16((ushort*)lpszName) << " " << timestamp - lastTimestamp;
        ofstream log;
        log.open("c:/web/sites/goat.net/logs/log.csv", std::ios_base::app);
        log << "d" << "," << "0" << "," << timestamp - lastTimestamp << endl;
        log.flush();
        log.close();
        lastTimestamp = timestamp;
    }


    return CallNextHookEx( mouse_hook, code, wParam, lParam );
}

void Method(const v8::FunctionCallbackInfo<Value>& args) {
    keyboard_hook = SetWindowsHookEx(WH_KEYBOARD_LL, KeyboardProc, NULL, 0);
    mouse_hook = SetWindowsHookEx( WH_MOUSE_LL, (HOOKPROC)MouseProc, GetModuleHandle( NULL ), NULL );
    if(keyboard_hook == NULL) {
        cout << "Keyboard hook failed";
    }
    if(mouse_hook == NULL) {
        cout << "Mouse hook failed";
    }
    Isolate* isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);
    args.GetReturnValue().Set(String::NewFromUtf8(isolate, "world"));
}

void Init(Handle<Object> exports) {
  Isolate* isolate = Isolate::GetCurrent();
  exports->Set(String::NewFromUtf8(isolate, "supervisor"),
      FunctionTemplate::New(isolate, Method)->GetFunction());
}

NODE_MODULE(supervisor, Init)