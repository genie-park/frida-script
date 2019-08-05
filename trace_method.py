import frida, sys

def on_message(message, data):
    if message['type'] == 'send':
        for item in message['payload'] :
          print (item)
    else:
        print(message)

process = frida.get_usb_device().attach('com.reddit.frontpage')
with open('trace.js') as f :
  template = f.read() 

with open('methodList.txt') as f : 
  lines = f.readlines()

start = 0 
end = 1000
num_of_method = len(lines)
while start < num_of_method :
  items = lines[start:end]
  class_method_list = []
  for item in items : 
      class_method_list.append('\'' + item.replace('\n', '') + '\'')         
  print (",".join(class_method_list))
  jscode = template.replace('CLASS_METHOD_LIST', ",".join(class_method_list)) 
  # print ('instrumetation: ' + line) 
  script = process.create_script(jscode)
  script.on('message', on_message)
  script.load()
  print('instrument: ' + str(start) + ' : ' + str(end) )
  start = end 
  end += 1000
  if (end > num_of_method) :
    end = num_of_method


sys.stdin.read()
