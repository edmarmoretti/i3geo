### Name: capture
### Title: Capture printed output of an R expression in a string
### Aliases: capture sprint
### Keywords: print IO

### ** Examples


# capture the results of a loop
loop.text <- capture( for(i in 1:10) cat("i=",i,"\n") )
loop.text

# put regression summary results into a string
data(iris)
reg <- lm( Sepal.Length ~ Species, data=iris )
summary.text <- sprint( summary(reg) )
cat(summary.text)



