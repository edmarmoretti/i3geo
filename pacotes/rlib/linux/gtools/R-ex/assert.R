### Name: assert
### Title: Generate an error if an expression is not true.
### Aliases: assert
### Keywords: programming

### ** Examples


## Trivial example
posSqrt <- function(x)
  {
    assert(x>=0)
    sqrt(x)
  }

posSqrt(1:10) # works fine, no messages
## Not run: 
##D posSqrt(-5:5) # generates an error, since the asssertion is not met
## End(Not run)




