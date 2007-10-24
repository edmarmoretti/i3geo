### Name: addLast
### Title: Add a function to be executed when R exits.
### Aliases: addLast
### Keywords: programming

### ** Examples


## Not run: 
##D ## Print a couple of cute messages when R exits.
##D helloWorld <- function() cat("\nHello World!\n")
##D byeWorld <- function() cat("\nGoodbye World!\n")
##D 
##D addLast(byeWorld)
##D addLast(helloWorld)
##D 
##D q("no")
##D 
##D ## Should yield:
##D ##
##D ##   Save workspace image? [y/n/c]: n
##D ##
##D ##   Hello World!
##D ##
##D ##   Goodbye World!
##D ##
##D ##   Process R finished at Tue Nov 22 10:28:55 2005
##D 
##D ## Unix-flavour example: send Rplots.ps to printer on exit.
##D myLast <- function()
##D {
##D   cat("Now sending PostScript graphics to the printer:\n")
##D   system("lpr Rplots.ps")
##D   cat("bye bye...\n")
##D }
##D addLast(myLast)
##D quit("yes")
##D 
##D ## Should yield:
##D ##
##D ##  Now sending PostScript graphics to the printer:
##D ##  lpr: job 1341 queued
##D ##  bye bye...
##D ##
##D ##   Process R finished at Tue Nov 22 10:28:55 2005
## End(Not run)




