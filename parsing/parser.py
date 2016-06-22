import sys
import json
import os
import datetime


##	Log
#
#	lvl = None log to console
#		< 0 ERROR
#		> 0 INFO
#		= 0 Debug
def log(msg, lvl):
	now = datetime.datetime.now()
	str_now = '\n'+str(now.day)+'/'+str(now.month)+'/'+str(now.year)+' '+str(now.hour)+':'+str(now.minute)+':'+str(now.second)+' '
	with open('python_script.log', 'a') as logfile:
		if(lvl is None):#normal
			print(msg)
		elif(lvl < 0):	#error
			print('\033[31;1m'+'[ERROR]\t'+'\033[0m'+msg)
			logfile.write(str_now+'[ERROR]\t'+msg)
		elif(lvl > 0):	#info
			print('\033[32m'+'[INFO]\t'+'\033[0m'+msg)
			logfile.write(str_now+'[INFO]\t'+msg)
		elif(lvl == 0):	#dbg
			print('\033[35;1m'+'[DEBUG]\t'+'\033[0m'+msg)
			logfile.write(str_now+'[DEBUG]\t'+msg)
	logfile.closed




##	Returns a list of FILES of the defined extension
#
#	returns only the file NAME (without the extension)
#	of files in current folder having that extension
def get_file_list(extension):
	all_files = os.listdir()
	file_list = []
	for file in all_files:
		tmp_file = get_file_name(file, extension)
		if(tmp_file is not None):
			log(tmp_file,0)
			file_list.append(file)
	return file_list


##	Checks a file (or filename) for extension
#
#	Return the file NAME without the extension if true
#	Return None otherwise
def get_file_name(file_in, extension):
	if(type(file_in) is str):
		file_full_name = os.path.splitext(os.path.split(file_in)[1])
	else:
		file_full_name = os.path.splitext(os.path.split(file_in.name)[1])
	file_name = file_full_name[0]
	file_ext = file_full_name[1]
	if(file_ext!=extension):
		return
	else:
		return file_name

##	Processes file
#
#	void
def process_file(filename):
	log('Processing file: '+filename, 1)
	with open(filename, 'r') as file_in:
		for line in file_in:
			json_line = json.loads(line)
			print (json.dumps(json_line, sort_keys=True, indent=4))
	file_in.closed


def main():
	#check if called for specific file
	#check this instead: https://docs.python.org/3/library/fileinput.html#module-fileinput
	if(len(sys.argv)>1):
		file_in = open(sys.argv[1], 'r')
		file_name = get_file_name(file_in, '.txt')
		if(file_name is None):
			exit('Wrong file extension ('+file_ext+') for file '+file_full_name[0]+file_full_name[1]+'   :  expected .txt')
		else:
			process_file(file_name+'.txt')
		file_in.close()
	#default case when check for every file in current folder with .txt extension
	else:
		file_list = get_file_list('.txt')
		for file_name in file_list:
			process_file(file_name)



#		file_in = open(file_list[0])
#		print(file_list)
#		print(file_in)
	input('continue?')


#That's All Folks!
	exit(0)

if __name__ == '__main__':
	main()
