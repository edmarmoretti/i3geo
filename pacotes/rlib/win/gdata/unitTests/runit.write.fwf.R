### runit.write.fwf.R
###------------------------------------------------------------------------
### What: Unit tests for write.fwf
### $Id: runit.write.fwf.R 997 2006-10-30 19:04:53Z ggorjan $
### Time-stamp: <2006-10-30 18:49:04 ggorjan>
###------------------------------------------------------------------------

### {{{ --- Test setup ---

if(FALSE) {
  library("RUnit")
  library("gdata")
}

### }}}
### {{{ --- write.fwf ---

test.write.fwf <- function()
{

  ## 'x' must be a data.frame or matrix
  checkException(write.fwf(1:10))
  checkException(write.fwf(list(1:10)))

  testData <- data.frame(num1=c(1:10, NA),
                         num2=c(NA, seq(from=1, to=5.5, by=0.5)),
                         num3=c(NA, rnorm(n=10, mean=1e6, sd=3e5)),
                         int1=c(as.integer(1:4), NA, as.integer(5:10)),
                         fac1=factor(c(NA, letters[1:10])),
                         fac2=factor(c(letters[6:15], NA)),
                         cha1=c(letters[17:26], NA),
                         cha2=c(NA, letters[26:17]),
                         stringsAsFactors=FALSE)
  levels(testData$fac1) <- c(levels(testData$fac1), "unusedLevel")
  testData$Date <- as.Date("1900-1-1")
  testData$Date[2] <- NA
  testData$POSIXt <- as.POSIXct(strptime("1900-1-1 01:01:01", format="%Y-%m-%d %H:%M:%S"))
  testData$POSIXt[5] <- NA

  ## --- output ---
  ## in regular tests

  ## --- formatInfo ---

  ## default output
  formatInfoT <- data.frame(colname=c("num1", "num2"),
                            nlevels=c(0, 0),
                            position=c(1, 4),
                            width=c(2, 3),
                            digits=c(0, 1),
                            exp=c(0, 0),
                            stringsAsFactors=FALSE)
  formatInfo  <- write.fwf(testData[, c("num1", "num2")], formatInfo=TRUE)
  checkEquals(formatInfo, formatInfoT)

  ## rowCol
  formatInfoTR <- data.frame(colname=c("row", "num1", "num2"),
                            nlevels=c(11, 0, 0),
                            position=c(1, 4, 7),
                            width=c(2, 2, 3),
                            digits=c(0, 0, 1),
                            exp=c(0, 0, 0),
                             stringsAsFactors=FALSE)
  formatInfoR <- write.fwf(testData[, c("num1", "num2")], formatInfo=TRUE,
                           rownames=TRUE, rowCol="row")
  checkEquals(formatInfoR, formatInfoTR)

  ## quoteInfo alone does not have any effect
  formatInfoI <- write.fwf(testData[, c("num1", "num2")], formatInfo=TRUE,
                           quoteInfo=TRUE)
  checkEquals(formatInfoI, formatInfoT)

  ## quote
  formatInfoQ <- write.fwf(testData[, c("num1", "num2")], formatInfo=TRUE,
                           quote=TRUE)
  formatInfoTQ <-  formatInfoT
  formatInfoTQ$position <- c(1, 6)
  formatInfoTQ$width <- c(4, 5)
  checkEquals(formatInfoQ, formatInfoTQ)

  ## quote without quoteInfo
  formatInfoQI <- write.fwf(testData[, c("num1", "num2")], formatInfo=TRUE,
                            quote=TRUE, quoteInfo=FALSE)
  formatInfoTQI <-  formatInfoT
  formatInfoTQI$position <- c(2, 6)
  checkEquals(formatInfoQI, formatInfoTQI)
}

### }}}
### {{{ Dear Emacs
## Local variables:
## folded-file: t
## End:
### }}}

###------------------------------------------------------------------------
### runit.write.fwf.R ends here
