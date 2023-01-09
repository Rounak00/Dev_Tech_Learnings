It is OpenSource OS.

Linux Vs Unix --> Unix is Foundations of Linux

<<-----------------------Basic Commands---------------------------->>
$ pwd --> print working directory (return absolute path)
$ ls --> show list of things present in directory
$ cd [name of subdirectoy] --> go to subdirectory (cd= chain directory)
$ cd.. --> back
$ mkdir [name of directory] --> make directory
$ touch [name.extention] --> make a  blank file
$ mv [file name.extention] [folder path] --> move element there
$ cp [file name.extention] [folder path] --> copy element there (for mv and cp instead only name and extention we can also use path/name.extention)


<<-----------------------Users------------------------------>>
1. Regular User -> only use home directory
2. Root User -> full aceess in any directory
3. when regular get permission of root then run any code but use 'sudo'  and  "sudo su" -> is more powerfull which is not recommended to use
4. Service user -> specially they use serve like apache

<<-----------------------Absolute Vs Relative Path---------------------------->>
think we need to fo a directory name rounak.txt now 
     absolute --> cd /bin/rounak.txt
     relative --> cd rounak.txt
     
<<-----------------------More  Commands---------------------------->>     
$ -> for regular user  # -> sudo user
$ sudo apt update --> use to shew all updated list of softwares
$ sudo apt upgrade --> install all softwares
$ ls -R --> show directory and subdirectory full list
$ ls -a --> show alldirectory include hide also 
$ touch [.filename] --> make hidden file that will not show in ls
$ clear --> clean terminal
$ history --> show all commands that we run
$ echo [write any thing] --> print in command line // printf also run like this --> printf "hello"
$ sudo apt install [name of software] --> install software



<<-----------------------Users Permission------------------------------>>
$ ls -l --> read write exicute with user show every file (show owner of each file) [as --> user-group-other]
$ chmod [permission number][file name]--> set user-group-public permission of a file
$ ps --> show all processes
$ ps -a --> show all processes including background process
$ kill [process id] --> kill a process
$
$
