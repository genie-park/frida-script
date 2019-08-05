import frida, sys

def on_message(message, data):
    if message['type'] == 'send':
        for item in message['payload'] :
          print (item)
    else:
        print(message)

process = frida.get_usb_device().attach('com.reddit.frontpage')
with open('getClassMethodList.js') as f :
  jscode = f.read() 

script = process.create_script(jscode)
script.on('message', on_message)
script.load()
sys.stdin.read()
