if(dev.cur() <= 1) get(getOption("device"))()

oldpar <- par(ask = interactive() &&
              (.Device %in% c("X11", "GTK", "windows", "Macintosh")))
par(mfrow=c(1,1))
oldoptions <- options(warn = -1)

# 
#######################################################
#

X <- rpoispp(function(x,y) { 1000 * exp(- 4 * x)}, 1000)
plot(X, main="Inhomogeneous Poisson pattern")

fit.hom <- ppm(X, ~1, Poisson())
fit.inhom <- ppm(X, ~x, Poisson())

diagnose.ppm(fit.inhom, which="marks", type="Pearson",
             main="Mark plot\nCircles for positive residual mass\nColour for negative residual density")

par(mfrow=c(1,2))
diagnose.ppm(fit.hom, which="marks")
title(sub="Wrong model (homogeneous Poisson)")
diagnose.ppm(fit.inhom, which="marks")
title(sub="Right model (inhomogeneous Poisson)")

par(mfrow=c(1,1))
diagnose.ppm(fit.inhom, which="smooth", main="Smoothed residual field")

par(mfrow=c(1,2))
diagnose.ppm(fit.hom, which="smooth", main="Smoothed residual field")
title(sub="Wrong model (homogeneous Poisson)")
diagnose.ppm(fit.inhom, which="smooth", main="Smoothed residual field")
title(sub="Right model (inhomogeneous Poisson)")

par(mfrow=c(1,1))
diagnose.ppm(fit.inhom, which="x")

par(mfrow=c(1,2))
diagnose.ppm(fit.hom, which="x")
title(sub="Wrong model (homogeneous Poisson)")
diagnose.ppm(fit.inhom, which="y")
title(sub="Right model (inhomogeneous Poisson)")

par(mfrow=c(1,1))
diagnose.ppm(fit.hom, type="Pearson",main="standard diagnostic plots")

par(mfrow=c(1,2))
diagnose.ppm(fit.hom, main="Wrong model (homogeneous Poisson)")
diagnose.ppm(fit.inhom,  main="Right model (inhomogeneous Poisson)")
par(mfrow=c(1,1))

# 
#######################################################
#  Q - Q  PLOTS
#
qqplot.ppm(fit.hom, 40) 
#conclusion: homogeneous Poisson model is not correct
title(main="Q-Q plot of smoothed residuals")

qqplot.ppm(fit.inhom, 40) # TAKES A WHILE...
# conclusion: fitted inhomogeneous Poisson model looks OK
# 
#######################################################
#
data(cells)
plot(cells)
fitPoisson <- ppm(cells, ~1, Poisson())
diagnose.ppm(fitPoisson)
diagnose.ppm(fitPoisson, type="pearson")
# These diagnostic plots do NOT show evidence of departure from uniform Poisson

qqplot.ppm(fitPoisson, 40) 
# Q-Q plot DOES show strong evidence of departure from uniform Poisson.
#
fitStrauss <- ppm(cells, ~1, Strauss(r=0.15), rbord=0.15)
diagnose.ppm(fitStrauss, rbord=0.15)
diagnose.ppm(fitStrauss, type="pearson", rbord=0.15)
qqplot.ppm(fitStrauss, 40) # TAKES A LOOOONG WHILE...
# Conclusion: Strauss model seems OK
# 
#######################################################
#
data(nztrees)
plot(nztrees)
fit <- ppm(nztrees, ~1, Poisson())
diagnose.ppm(fit)
diagnose.ppm(fit, type="pearson")
# Diagnostic plots suggest that the uniform Poisson model
# is a good fit to 'nztrees' data.
qqplot.ppm(fit, 40)
# Slight suggestion of departure from Poisson at top right of pattern.

par(oldpar)
options(oldoptions)
