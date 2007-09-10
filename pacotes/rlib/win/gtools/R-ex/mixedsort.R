### Name: mixedsort
### Title: Order or Sort strings with embedded numbers so that the numbers
###   are in the correct order
### Aliases: mixedsort mixedorder
### Keywords: univar manip

### ** Examples

# compound & dose labels
Treatment <- c("Control", "Asprin 10mg/day", "Asprin 50mg/day",
               "Asprin 100mg/day", "Acetomycin 100mg/day",
               "Acetomycin 1000mg/day")

# ordinary sort puts the dosages in the wrong order
sort(Treatment)

# but mixedsort does the 'right' thing
mixedsort(Treatment)

# Here is a more complex example
x <- rev(c("AA 0.50 ml", "AA 1.5 ml", "AA 500 ml", "AA 1500 ml",
           "EXP 1", "AA 1e3 ml", "A A A", "1 2 3 A", "NA", NA, "1e2",
           "", "-", "1A", "1 A", "100", "100A", "Inf"))

mixedorder(x)

mixedsort(x)
# notice that plain numbers, including 'Inf' show up before strings.




