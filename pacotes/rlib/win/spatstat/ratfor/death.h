#ifdef MARKED
#define DEATH(x,y,marks,npts,ix) deathm(x,y,marks,npts,ix)
#else
#define DEATH(x,y,marks,npts,ix) deathu(x,y,npts,ix)
#endif

