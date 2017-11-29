import datetime
import json
import os
import re
import sys
import xml.etree.ElementTree as ET

#Parameters
#Paremeters for input files
FILE_IN_DIR = 'parsing'    #dir with files to be parsed
TIMING_FILE_EXTENSION = '.xml'
TIMINIG_XML_SUFFIX = '_EbuCore'
SENSOR_FILE_EXTENSION = '.xml'
SENSOR_XML_SUFFIX = '_SENSORDATA'
VIDEO_FILE_EXTENSION = '.webm'

#Paremeters for output files
LOGFILE = 'python_script.log'    #logfile
OUTPUTDIR = 'script_out'
PLAYLIST = 'playlist.txt'    #generated playlist containing formated files

#Parameters for parser
USE_ORIENTATION_AVERAGE = True    #else use latest orientation
USE_FULL_FILENAME_IN_PLAYLIST = False    #otherwise use only ID (without the OUT_ and .txt)
LOG_STATISTICS = True
CLEAR_LOG = True      #When init log - delete previous logfile

#Global vars
orient_count = 0
orient_start = 0
orient_dur = 0
orient_dur_tot = 0
orient_obj = None

#constants
LOG_LVL_ERROR = -1
LOG_LVL_DEBUG = 0
LOG_LVL_INFO = 1

##    Log
#
#    lvl = None log to console
#        < 0 ERROR
#        > 0 INFO
#        = 0 Debug
def log(msg, lvl):
    now = datetime.datetime.now()
    str_now = '\n'+str(now.day)+'/'+str(now.month)+'/'+str(now.year)+' '+str(now.hour)+':'+str(now.minute)+':'+str(now.second)+' '
    str_now = str_now.ljust(19)
    with open(LOGFILE, 'a') as logfile:
        if(lvl is None):#normal
            print(msg)
        elif(lvl < 0):    #error
            print('\033[31m'+'[ERROR]\t'+'\033[0m'+msg)
            logfile.write(str_now+'[ERROR]\t'+msg)
        elif(lvl > 0):    #info
            print('\033[32m'+'[INFO]\t'+'\033[0m'+msg)
            logfile.write(str_now+'[INFO]\t'+msg)
        elif(lvl == 0):    #dbg
            print('\033[35m'+'[DEBUG]\t'+'\033[0m'+msg)
            logfile.write(str_now+'[DEBUG]\t'+msg)

def log_blankline():
    with open(LOGFILE, 'a') as logfile:
        print('\n')
        logfile.write('\n')

log_location_dict = dict()

## initialize log_location_dict
def log_location_init():
    global log_location_dict
    log_location_dict['minDiff'] = 0
    log_location_dict['maxDiff'] = 0
    log_location_dict['avgDiff'] = 0
    log_location_dict['sum'] = 0
    log_location_dict['count'] = 0
    log_location_dict['baseNano'] = 0
    log_location_dict['baseTime'] = 0
    log_location_dict['nanoDiffSum'] = 0
    log_location_dict['timeDiffSum'] = 0


## Process location for analysis
def log_location(json_loc):
    global log_location_dict
    diff = json_loc['Time']-(json_loc['LocalNanostamp']/1000000)
    if log_location_dict['count'] == 0:
        log_location_dict['count']+=1
        return
    if log_location_dict['count'] == 1:
        log_location_dict['minDiff'] = diff
        log_location_dict['baseNano'] = json_loc['LocalNanostamp']
        log_location_dict['baseTime'] = json_loc['Time']
    else:
        log_location_dict['nanoDiffSum'] += (json_loc['LocalNanostamp'] - log_location_dict['baseNano'])/1000000
        log_location_dict['timeDiffSum'] += (json_loc['Time']-log_location_dict['baseTime'])
        log("nano diff: "+str((json_loc['LocalNanostamp'] - log_location_dict['baseNano'])/1000000)+"    time diff: "+str(json_loc['Time']-log_location_dict['baseTime']), 1)
        log_location_dict['baseNano'] = json_loc['LocalNanostamp']
        log_location_dict['baseTime'] = json_loc['Time']
    if(log_location_dict['minDiff'] > diff):
        log_location_dict['minDiff'] = diff
    if(log_location_dict['maxDiff']<diff):
        log_location_dict['maxDiff'] = diff
    log_location_dict['count']+=1
    log_location_dict['sum']+=diff


## flush to logfile
def log_location_flush():
    global log_location_dict
    if log_location_dict['count'] > 0:
        log("nano diff sum: "+str(log_location_dict['nanoDiffSum'])+"    time diff sum: "+str(log_location_dict['timeDiffSum']), 1)
        log("minDiff: "+str(log_location_dict['minDiff']), 1)
        log("maxDiff: "+str(log_location_dict['maxDiff']), 1)
        log("avgDiff: "+str(log_location_dict['sum']/log_location_dict['count']-1), 1)
    log_blankline()
    log_location_init()


def main():
    if (CLEAR_LOG):
        if os.path.isfile(LOGFILE):
            os.remove(LOGFILE)
    #check if called for specific file    - TODO for new dataset
    #check this instead: https://docs.python.org/3/library/fileinput.html#module-fileinput
    if (len(sys.argv) > 1):
        file_in = sys.argv[1]
        log('PROCESSING FILE: ' + file_in, LOG_LVL_INFO)
        try:
            file_in_video = open(file_in + VIDEO_FILE_EXTENSION, 'r')
        except:
            log('INVALID FILE NAME', LOG_LVL_ERROR)
            raise
        try:
            file_in_timing = open(file_in + TIMINIG_XML_SUFFIX + TIMING_FILE_EXTENSION, 'r')
        except:
            log('video file found, but without associated timing file. Aborting', LOG_LVL_ERROR)
            raise
        file_name = get_file_name(file_in, '.txt')
        if file_name is None:
            exit('Wrong file extension (' + file_ext + ') for file ' + file_full_name[0] + file_full_name[1] + '   :  expected .txt')
        else:
            process_file(file_name + '.txt')
        file_in.close()
    #default case when check for every file in current folder with .txt extension
    else:
        log('PROVIDE A FILE TO PARSE', -1)



#        file_in = open(file_list[0])
#        print(file_list)
#        print(file_in)
    input('continue?')


    #That's All Folks!
    exit(0)

if __name__ == '__main__':
    main()
