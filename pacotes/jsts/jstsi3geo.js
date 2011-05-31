/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/*jslint forin: true */


/**
 * @namespace
 */
jsts = {
  version: '1.11-SNAPSHOT'
};


/**
 * @namespace
 */
jsts.error = {};



/**
 * @param {String}
 *          message User defined error message.
 * @constructor
 */
jsts.error.IllegalArgumentError = function(message) {
  this.name = 'IllegalArgumentError';
  this.message = (message || '');
};
jsts.error.IllegalArgumentError.prototype = new Error();



/**
 * @constructor
 */
jsts.error.TopologyError = function(message) {
  this.name = 'TopologyError';
  this.message = (message || '');
};
jsts.error.TopologyError.prototype = new Error();



/**
 * @constructor
 */
jsts.error.AbstractMethodInvocationError = function() {
  this.name = 'AbstractMethodInvocationError';
  this.message = 'Abstract method called, should be implemented in subclass.';
};
jsts.error.AbstractMethodInvocationError.prototype = new Error();



/**
 * @constructor
 */
jsts.error.NotImplementedError = function() {
  this.name = 'NotImplementedError';
  this.message = 'This method has not yet been implemented.';
};
jsts.error.NotImplementedError.prototype = new Error();



/**
 * @constructor
 */
jsts.error.NotRepresentableError = function(message) {
  this.name = 'NotRepresentableError';
  this.message = (message || '');
};
jsts.error.NotRepresentableError.prototype = new Error();

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


/**
 * @namespace
 */
jsts.geom = {

};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * @constructor
 */
jsts.geom.CoordinateArrays = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * If the coordinate array argument has repeated points, constructs a new array
 * containing no repeated points. Otherwise, returns the argument.
 *
 * @return {Coordinate[]}
 * @see #hasRepeatedPoints(Coordinate[])
 */
jsts.geom.CoordinateArrays.removeRepeatedPoints = function(coord) {
  var coordList;
  if (!this.hasRepeatedPoints(coord)) {
    return coord;
  }
  coordList = new jsts.geom.CoordinateList(coord, false);
  return coordList;
};


/**
 * Returns whether #equals returns true for any two consecutive Coordinates in
 * the given array.
 *
 * @param {Coordinate[]}
 *          coord
 * @return {boolean}
 */
jsts.geom.CoordinateArrays.hasRepeatedPoints = function(coord) {
  var i;
  for (i = 1; i < coord.length; i++) {
    if (coord[i - 1].equals(coord[i])) {
      return true;
    }
  }
  return false;
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Constructs a new list from an array of Coordinates, allowing caller to
 * specify if repeated points are to be removed.
 *
 * @param {Coordinate[]}
 *          coord the array of coordinates to load into the list.
 * @param {boolean}
 *          allowRepeated if <code>false</code>, repeated points are removed.
 *
 * @constructor
 */
jsts.geom.CoordinateList = function(coord, allowRepeated) {
  this.add(coord, allowRepeated);
};

jsts.geom.CoordinateList.prototype = new Array();


/**
 * Adds an array of coordinates to the list.
 *
 * @param {Coordinate[] }
 *          coord The coordinates.
 * @param {boolean}
 *          allowRepeated if set to false, repeated coordinates are collapsed.
 * @param {boolean}
 *          direction if false, the array is added in reverse order.
 * @return {boolean} true (as by general collection contract).
 */
jsts.geom.CoordinateList.prototype.add = function(coord, allowRepeated,
    direction) {
  direction = direction || true;

  if (direction) {
    for (var i = 0; i < coord.length; i++) {
      this.addCoordinate(coord[i], allowRepeated);
    }
  } else {
    for (var i = coord.length - 1; i >= 0; i--) {
      this.addCoordinate(coord[i], allowRepeated);
    }
  }
  return true;
};


/**
 * Adds a coordinate to the end of the list.
 *
 * @param {Coordinate}
 *          coord The coordinates.
 * @param {boolean}
 *          allowRepeated if set to false, repeated coordinates are collapsed.
 */
jsts.geom.CoordinateList.prototype.addCoordinate = function(coord,
    allowRepeated) {
  // don't add duplicate coordinates
  if (!allowRepeated) {
    if (this.length >= 1) {
      var last = this[this.length - 1];
      if (last.equals2D(coord))
        return;
    }
  }
  this.push(coord);
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Provides constants representing the dimensions of a point, a curve and a
 * surface. Also provides constants representing the dimensions of the empty
 * geometry and non-empty geometries, and the wildcard constant
 * {@link #DONTCARE} meaning "any dimension". These constants are used as the
 * entries in {@link IntersectionMatrix}s.
 *
 * @constructor
 */
jsts.geom.Dimension = function() {
};


/**
 * Dimension value of a point (0).
 *
 * @type {int}
 */
jsts.geom.Dimension.P = 0;


/**
 * Dimension value of a curve (1).
 *
 * @type {int}
 */
jsts.geom.Dimension.L = 1;


/**
 * Dimension value of a surface (2).
 *
 * @type {int}
 */
jsts.geom.Dimension.A = 2;


/**
 * Dimension value of the empty geometry (-1).
 *
 * @type {int}
 */
jsts.geom.Dimension.FALSE = -1;


/**
 * Dimension value of non-empty geometries (= {P, L, A}).
 *
 * @type {int}
 */
jsts.geom.Dimension.TRUE = -2;


/**
 * Dimension value for any dimension (= {FALSE, TRUE}).
 *
 * @type {int}
 */
jsts.geom.Dimension.DONTCARE = -3;


/**
 * Converts the dimension value to a dimension symbol, for example,
 * <code>TRUE => 'T'</code> .
 *
 * @param {int}
 *          dimensionValue a number that can be stored in the
 *          <code>IntersectionMatrix</code> . Possible values are
 *          <code>{TRUE, FALSE, DONTCARE, 0, 1, 2}</code>.
 * @return {String} a character for use in the string representation of an
 *         <code>IntersectionMatrix</code>. Possible values are
 *         <code>{T, F, * , 0, 1, 2}</code> .
 */
jsts.geom.Dimension.toDimensionSymbol = function(dimensionValue) {
  switch (dimensionValue) {
    case jsts.geom.Dimension.FALSE:
      return 'F';
    case jsts.geom.Dimension.TRUE:
      return 'T';
    case jsts.geom.Dimension.DONTCARE:
      return '*';
    case jsts.geom.Dimension.P:
      return '0';
    case jsts.geom.Dimension.L:
      return '1';
    case jsts.geom.Dimension.A:
      return '2';
  }
  throw new jsts.IllegalArgumentError('Unknown dimension value: ' +
      dimensionValue);
};


/**
 * Converts the dimension symbol to a dimension value, for example,
 * <code>'*' => DONTCARE</code> .
 *
 * @param {string}
 *          dimensionSymbol a character for use in the string representation of
 *          an <code>IntersectionMatrix</code>. Possible values are
 *          <code>{T, F, * , 0, 1, 2}</code> .
 * @return {int} a number that can be stored in the
 *         <code>IntersectionMatrix</code> . Possible values are
 *         <code>{TRUE, FALSE, DONTCARE, 0, 1, 2}</code>.
 */
jsts.geom.Dimension.toDimensionValue = function(dimensionSymbol) {
  switch (dimensionSymbol.toUpperCase()) {
    case 'F':
      return jsts.geom.Dimension.FALSE;
    case 'T':
      return jsts.geom.Dimension.TRUE;
    case '*':
      return jsts.geom.Dimension.DONTCARE;
    case '0':
      return jsts.geom.Dimension.P;
    case '1':
      return jsts.geom.Dimension.L;
    case '2':
      return jsts.geom.Dimension.A;
  }
  throw new jsts.error.IllegalArgumentError('Unknown dimension symbol: ' +
      dimensionSymbol);
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Constants representing the different topological locations which can occur in
 * a {@link Geometry}. The constants are also used as the row and column
 * indices of DE-9IM {@link IntersectionMatrix}es.
 *
 * @constructor
 */
jsts.geom.Location = function() {
};


/**
 * The location value for the interior of a geometry. Also, DE-9IM row index of
 * the interior of the first geometry and column index of the interior of the
 * second geometry.
 *
 * @type {int}
 */
jsts.geom.Location.INTERIOR = 0;


/**
 * The location value for the boundary of a geometry. Also, DE-9IM row index of
 * the boundary of the first geometry and column index of the boundary of the
 * second geometry.
 *
 * @type {int}
 */
jsts.geom.Location.BOUNDARY = 1;


/**
 * The location value for the exterior of a geometry. Also, DE-9IM row index of
 * the exterior of the first geometry and column index of the exterior of the
 * second geometry.
 *
 * @type {int}
 */
jsts.geom.Location.EXTERIOR = 2;


/**
 * Used for uninitialized location values.
 *
 * @type {int}
 */
jsts.geom.Location.NONE = -1;


/**
 * Converts the location value to a location symbol, for example,
 * <code>EXTERIOR => 'e'</code> .
 *
 * @param {int}
 *          locationValue either EXTERIOR, BOUNDARY, INTERIOR or NONE.
 * @return {String} either 'e', 'b', 'i' or '-'.
 */
jsts.geom.Location.toLocationSymbol = function(locationValue) {
  switch (locationValue) {
    case jsts.geom.Location.EXTERIOR:
      return 'e';
    case jsts.geom.Location.BOUNDARY:
      return 'b';
    case jsts.geom.Location.INTERIOR:
      return 'i';
    case jsts.geom.Location.NONE:
      return '-';
  }
  throw new jsts.IllegalArgumentError('Unknown location value: ' +
      locationValue);
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * The base class for all geometric objects.
 *
 *  <H3>Binary Predicates</H3>
 * Because it is not clear at this time
 * what semantics for spatial
 *  analysis methods involving <code>GeometryCollection</code>s would be useful,
 *  <code>GeometryCollection</code>s are not supported as arguments to binary
 *  predicates (other than <code>convexHull</code>) or the <code>relate</code>
 *  method.
 *
 *  <H3>Set-Theoretic Methods</H3>
 *
 *  The spatial analysis methods will
 *  return the most specific class possible to represent the result. If the
 *  result is homogeneous, a <code>Point</code>, <code>LineString</code>, or
 *  <code>Polygon</code> will be returned if the result contains a single
 *  element; otherwise, a <code>MultiPoint</code>, <code>MultiLineString</code>,
 *  or <code>MultiPolygon</code> will be returned. If the result is
 *  heterogeneous a <code>GeometryCollection</code> will be returned. <P>
 *
 *  Because it is not clear at this time what semantics for set-theoretic
 *  methods involving <code>GeometryCollection</code>s would be useful,
 * <code>GeometryCollections</code>
 *  are not supported as arguments to the set-theoretic methods.
 *
 *  <H4>Representation of Computed Geometries </H4>
 *
 *  The SFS states that the result
 *  of a set-theoretic method is the "point-set" result of the usual
 *  set-theoretic definition of the operation (SFS 3.2.21.1). However, there are
 *  sometimes many ways of representing a point set as a <code>Geometry</code>.
 *  <P>
 *
 *  The SFS does not specify an unambiguous representation of a given point set
 *  returned from a spatial analysis method. One goal of JTS is to make this
 *  specification precise and unambiguous. JTS will use a canonical form for
 *  <code>Geometry</code>s returned from spatial analysis methods. The canonical
 *  form is a <code>Geometry</code> which is simple and noded:
 *  <UL>
 *    <LI> Simple means that the Geometry returned will be simple according to
 *    the JTS definition of <code>isSimple</code>.
 *    <LI> Noded applies only to overlays involving <code>LineString</code>s. It
 *    means that all intersection points on <code>LineString</code>s will be
 *    present as endpoints of <code>LineString</code>s in the result.
 *  </UL>
 *  This definition implies that non-simple geometries which are arguments to
 *  spatial analysis methods must be subjected to a line-dissolve process to
 *  ensure that the results are simple.
 *
 *  <H4> Constructed Points And The Precision Model </H4>
 *
 *  The results computed by the set-theoretic methods may contain constructed
 *  points which are not present in the input <code>Geometry</code>.
 *  These new points arise from intersections between line segments in the
 *  edges of the input <code>Geometry</code>s. In the general case it is not
 *  possible to represent constructed points exactly. This is due to the fact
 *  that the coordinates of an intersection point may contain twice as many bits
 *  of precision as the coordinates of the input line segments. In order to
 *  represent these constructed points explicitly, JTS must truncate them to fit
 *  the <code>PrecisionModel</code>.
 *
 *  Unfortunately, truncating coordinates moves them slightly. Line segments
 *  which would not be coincident in the exact result may become coincident in
 *  the truncated representation. This in turn leads to "topology collapses" --
 *  situations where a computed element has a lower dimension than it would in
 *  the exact result.
 *
 *  When JTS detects topology collapses during the computation of spatial
 *  analysis methods, it will throw an exception. If possible the exception will
 *  report the location of the collapse.
 *
 *  #equals(Object) and #hashCode are not overridden, so that when two
 *  topologically equal Geometries are added to HashMaps and HashSets, they
 *  remain distinct. This behaviour is desired in many cases.
 */



/**
 * Creates a new <tt>Geometry</tt> via the specified GeometryFactory.
 *
 * @constructor
 */
jsts.geom.Geometry = function() {
};

jsts.geom.Geometry = OpenLayers.Class();


/**
 * The bounding box of this <code>Geometry</code>.
 */
jsts.geom.Geometry.prototype.envelope = null;


/**
 * The PrecisionModel of this <code>Geometry</code>.
 */
jsts.geom.Geometry.prototype.precisionModel = null;


/**
 * Returns the name of this object's <code>com.vivid.jts.geom</code>
 * interface.
 *
 * @return {String} the name of this <code>Geometry</code>s most specific
 *         <code>jsts.geom</code> interface.
 */
jsts.geom.Geometry.prototype.getGeometryType = function() {
  return 'Geometry';
};


/**
 * Returns true if the array contains any non-empty <code>Geometry</code>s.
 *
 * @param {Geometry[]}
 *          geometries an array of <code>Geometry</code>s; no elements may be
 *          <code>null.</code>
 * @return {Boolean} <code>true</code> if any of the <code>Geometry</code>s
 *         <code>isEmpty</code> methods return <code>false.</code>
 */
jsts.geom.Geometry.hasNonEmptyElements = function(geometries) {
  var i;
  for (i = 0; i < geometries.length; i++) {
    if (!geometries[i].isEmpty()) {
      return true;
    }
  }
  return false;
};


/**
 * Returns true if the array contains any <code>null</code> elements.
 *
 * @param {Object[]}
 *          array an array to validate.
 * @return {Boolean} <code>true</code> if any of <code>array</code>s
 *         elements are <code>null.</code>
 */
jsts.geom.Geometry.hasNullElements = function(array) {
  var i;
  for (i = 0; i < array.length; i++) {
    if (array[i] === null) {
      return true;
    }
  }
  return false;
};


/**
 * Gets the factory which contains the context in which this geometry was
 * created.
 *
 * @return {jsts.geom.GeometryFactory} the factory for this geometry.
 */
jsts.geom.Geometry.prototype.getFactory = function() {
  return new jsts.geom.GeometryFactory();
};


/**
 * Returns the number of {@link Geometry}s in a {@link GeometryCollection} (or
 * 1, if the geometry is not a collection).
 *
 * @return {int} the number of geometries contained in this geometry.
 */
jsts.geom.Geometry.prototype.getNumGeometries = function() {
  return 1;
};


/**
 * Returns an element {@link Geometry} from a {@link GeometryCollection} (or
 * <code>this</code>, if the geometry is not a collection).
 *
 * @param {int}
 *          n the index of the geometry element.
 * @return {Geometry} the n'th geometry contained in this geometry.
 */
jsts.geom.Geometry.prototype.getGeometryN = function(n) {
  return this;
};


/**
 * Returns the <code>PrecisionModel</code> used by the <code>Geometry</code>.
 *
 * @return {PrecisionModel} the specification of the grid of allowable points,
 *         for this <code>Geometry</code> and all other <code>Geometry</code>s.
 */
jsts.geom.Geometry.prototype.getPrecisionModel = function() {
  if (this.precisionModel === null) {
    this.precisionModel = new jsts.geom.PrecisionModel();
  }

  return this.precisionModel;
};


/**
 * Returns a vertex of this <code>Geometry</code> (usually, but not
 * necessarily, the first one). The returned coordinate should not be assumed to
 * be an actual Coordinate object used in the internal representation.
 *
 * @return {Coordinate} a {@link Coordinate} which is a vertex of this
 *         <code>Geometry</code>. null if this Geometry is empty.
 */
jsts.geom.Geometry.prototype.getCoordinate = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * Returns an array containing the values of all the vertices for this geometry.
 * If the geometry is a composite, the array will contain all the vertices for
 * the components, in the order in which the components occur in the geometry.
 * <p>
 * In general, the array cannot be assumed to be the actual internal storage for
 * the vertices. Thus modifying the array may not modify the geometry itself.
 * Use the {@link CoordinateSequence#setOrdinate} method (possibly on the
 * components) to modify the underlying data. If the coordinates are modified,
 * {@link #geometryChanged} must be called afterwards.
 *
 * @return {Coordinate[]} the vertices of this <code>Geometry.</code>
 * @see geometryChanged
 * @see CoordinateSequence#setOrdinate
 */
jsts.geom.Geometry.prototype.getCoordinates = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * Returns the count of this <code>Geometry</code>s vertices. The
 * <code>Geometry</code> s contained by composite <code>Geometry</code>s
 * must be Geometry's; that is, they must implement <code>getNumPoints</code>
 *
 * @return {int} the number of vertices in this <code>Geometry.</code>
 */
jsts.geom.Geometry.prototype.getNumPoints = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * Tests whether this {@link Geometry} is simple. In general, the SFS
 * specification of simplicity follows the rule:
 * <UL>
 * <LI> A Geometry is simple iff the only self-intersections are at boundary
 * points.
 * </UL>
 * Simplicity is defined for each {@link Geometry} subclass as follows:
 * <ul>
 * <li>Valid polygonal geometries are simple by definition, so
 * <code>isSimple</code> trivially returns true.
 * <li>Linear geometries are simple iff they do not self-intersect at points
 * other than boundary points.
 * <li>Zero-dimensional geometries (points) are simple iff they have no
 * repeated points.
 * <li>Empty <code>Geometry</code>s are always simple
 * <ul>
 *
 * @return {boolean} <code>true</code> if this <code>Geometry</code> has any
 *         points of self-tangency, self-intersection or other anomalous points.
 * @see #isValid
 */
jsts.geom.Geometry.prototype.isSimple = function() {
  this.checkNotGeometryCollection(this);
  var op = new jsts.operation.IsSimpleOp(this);
  return op.isSimple();
};


/**
 * Tests the validity of this <code>Geometry</code>. Subclasses provide their
 * own definition of "valid".
 *
 * @return {boolean} <code>true</code> if this <code>Geometry</code> is
 *         valid.
 *
 * @see IsValidOp
 */
jsts.geom.Geometry.prototype.isValid = function() {
  var isValidOp = new IsValidOp(this);
  return isValidOp.isValid();
};


/**
 * Returns whether or not the set of points in this <code>Geometry</code> is
 * empty.
 *
 * @return {boolean} <code>true</code> if this <code>Geometry</code> equals
 *         the empty geometry.
 */
jsts.geom.Geometry.prototype.isEmpty = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * Returns the minimum distance between this <code>Geometry</code> and the
 * <code>Geometry</code> g
 *
 * @param {Geometry}
 *          g the <code>Geometry</code> from which to compute the distance.
 * @return {double} the distance between the geometries. 0 if either input
 *         geometry is empty.
 * @throws IllegalArgumentException
 *           if g is null
 */
jsts.geom.Geometry.prototype.distance = function(g) {
  return jsts.operation.distance.DistanceOp.distance(this, g);
};


/**
 * Tests whether the distance from this <code>Geometry</code> to another is
 * less than or equal to a specified value.
 *
 * @param {Geometry}
 *          geom the Geometry to check the distance to.
 * @param {double}
 *          distance the distance value to compare.
 * @return {boolean} <code>true</code> if the geometries are less than
 *         <code>distance</code> apart.
 */
jsts.geom.Geometry.prototype.isWithinDistance = function(geom, distance) {
  var envDist = this.getEnvelopeInternal().distance(geom.getEnvelopeInternal());
  if (envDist > distance) {
    return false;
  }
  return DistanceOp.isWithinDistance(this, geom, distance);
};


/**
 * Returns the area of this <code>Geometry</code>. Areal Geometries have a
 * non-zero area. They override this function to compute the area. Others return
 * 0.0
 *
 * @return {double} the area of the Geometry.
 */
jsts.geom.Geometry.prototype.getArea = function() {
  return 0.0;
};


/**
 * Returns the length of this <code>Geometry</code>. Linear geometries return
 * their length. Areal geometries return their perimeter. They override this
 * function to compute the area. Others return 0.0
 *
 * @return {double} the length of the Geometry.
 */
jsts.geom.Geometry.prototype.getLength = function() {
  return 0.0;
};


/**
 * Computes the centroid of this <code>Geometry</code>. The centroid is equal
 * to the centroid of the set of component Geometries of highest dimension
 * (since the lower-dimension geometries contribute zero "weight" to the
 * centroid)
 *
 * @return a {@link Point} which is the centroid of this Geometry.
 */
jsts.geom.Geometry.prototype.getCentroid = function() {
  if (isEmpty()) {
    return null;
  }
  var cent;
  var centPt = null;
  var dim = this.getDimension();
  if (dim === 0) {
    cent = new CentroidPoint();
    cent.add(this);
    centPt = cent.getCentroid();
  } else if (dim === 1) {
    cent = new CentroidLine();
    cent.add(this);
    centPt = cent.getCentroid();
  } else {
    cent = new CentroidArea();
    cent.add(this);
    centPt = cent.getCentroid();
  }
  return this.createPointFromInternalCoord(centPt, this);

};


/**
 * Computes an interior point of this <code>Geometry</code>. An interior
 * point is guaranteed to lie in the interior of the Geometry, if it possible to
 * calculate such a point exactly. Otherwise, the point may lie on the boundary
 * of the geometry.
 *
 * @return {Point} a {@link Point} which is in the interior of this Geometry.
 */
jsts.geom.Geometry.prototype.getInteriorPoint = function() {
  var intPt;
  var interiorPt = null;
  var dim = getDimension();
  if (dim === 0) {
    intPt = new InteriorPointPoint(this);
    interiorPt = intPt.getInteriorPoint();
  } else if (dim === 1) {
    intPt = new InteriorPointLine(this);
    interiorPt = intPt.getInteriorPoint();
  } else {
    intPt = new InteriorPointArea(this);
    interiorPt = intPt.getInteriorPoint();
  }
  return this.createPointFromInternalCoord(interiorPt, this);
};


/**
 * Returns the dimension of this geometry. The dimension of a geometry is is the
 * topological dimension of its embedding in the 2-D Euclidean plane. In the JTS
 * spatial model, dimension values are in the set {0,1,2}.
 * <p>
 * Note that this is a different concept to the dimension of the vertex
 * {@link Coordinate}s. The geometry dimension can never be greater than the
 * coordinate dimension. For example, a 0-dimensional geometry (e.g. a Point)
 * may have a coordinate dimension of 3 (X,Y,Z).
 *
 * @return {int} the topological dimension of this geometry.
 */
jsts.geom.Geometry.prototype.getDimension = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * Returns the boundary, or an empty geometry of appropriate dimension if this
 * <code>Geometry</code> is empty. (In the case of zero-dimensional
 * geometries, ' an empty GeometryCollection is returned.) For a discussion of
 * this function, see the OpenGIS Simple Features Specification. As stated in
 * SFS Section 2.1.13.1, "the boundary of a Geometry is a set of Geometries of
 * the next lower dimension."
 *
 * @return {Geometry} the closure of the combinatorial boundary of this
 *         <code>Geometry.</code>
 */
jsts.geom.Geometry.prototype.getBoundary = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * Returns the dimension of this <code>Geometry</code>s inherent boundary.
 *
 * @return {int} the dimension of the boundary of the class implementing this
 *         interface, whether or not this object is the empty geometry. Returns
 *         <code>Dimension.FALSE</code> if the boundary is the empty geometry.
 */
jsts.geom.Geometry.prototype.getBoundaryDimension = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * Returns this <code>Geometry</code>s bounding box. If this
 * <code>Geometry</code> is the empty geometry, returns an empty
 * <code>Point</code>. If the <code>Geometry</code> is a point, returns a
 * non-empty <code>Point</code>. Otherwise, returns a <code>Polygon</code>
 * whose points are (minx, miny), (maxx, miny), (maxx, maxy), (minx, maxy),
 * (minx, miny).
 *
 * @return {Geometry} an empty <code>Point</code> (for empty
 *         <code>Geometry</code>s), a <code>Point</code> (for
 *         <code>Point</code>s) or a <code>Polygon</code> (in all other
 *         cases).
 */
jsts.geom.Geometry.prototype.getEnvelope = function() {
  return this.getFactory().toGeometry(this.getEnvelopeInternal());
};


/**
 * Returns the minimum and maximum x and y values in this <code>Geometry</code>,
 * or a null <code>Envelope</code> if this <code>Geometry</code> is empty.
 *
 * @return {Envelope} this <code>Geometry</code>s bounding box; if the
 *         <code>Geometry</code> is empty, <code>Envelope#isNull</code> will
 *         return <code>true.</code>
 */
jsts.geom.Geometry.prototype.getEnvelopeInternal = function() {
  if (this.envelope === null) {
    this.envelope = this.computeEnvelopeInternal();
  }
  return this.envelope;
};


/**
 * Tests whether this geometry is disjoint from the specified geometry.
 * <p>
 * The <code>disjoint</code> predicate has the following equivalent
 * definitions:
 * <ul>
 * <li>The two geometries have no point in common
 * <li>The DE-9IM Intersection Matrix for the two geometries matches
 * <code>[FF*FF****]</code>
 * <li><code>! g.intersects(this)</code> (<code>disjoint</code> is the
 * inverse of <code>intersects</code>)
 * </ul>
 *
 * @param {Geometry}
 *          g the <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @return {boolean} <code>true</code> if the two <code>Geometry</code>s
 *         are disjoint.
 *
 * @see Geometry#intersects
 */
jsts.geom.Geometry.prototype.disjoint = function(g) {
  return !this.intersects(g);
};


/**
 * Tests whether this geometry touches the specified geometry.
 * <p>
 * The <code>touches</code> predicate has the following equivalent
 * definitions:
 * <ul>
 * <li>The geometries have at least one point in common, but their interiors do
 * not intersect.
 * <li>The DE-9IM Intersection Matrix for the two geometries matches
 * <code>[FT*******]</code> or <code>[F**T*****]</code> or
 * <code>[F***T****]</code>
 * </ul>
 * If both geometries have dimension 0, this predicate returns
 * <code>false</code>
 *
 * @param {Geometry}
 *          g the <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @return {boolean} <code>true</code> if the two <code>Geometry</code>s
 *         touch; Returns <code>false</code> if both <code>Geometry</code>s
 *         are points.
 */
jsts.geom.Geometry.prototype.touches = function(g) {
  // short-circuit test
  if (!this.getEnvelopeInternal().intersects(g.getEnvelopeInternal())) {
    return false;
  }
  return this.relate(g).isTouches(this.getDimension(), g.getDimension());
};


/**
 * Tests whether this geometry intersects the specified geometry.
 * <p>
 * The <code>intersects</code> predicate has the following equivalent
 * definitions:
 * <ul>
 * <li>The two geometries have at least one point in common
 * <li>The DE-9IM Intersection Matrix for the two geometries matches
 * <code>[T********]</code> or <code>[*T*******]</code> or
 * <code>[***T*****]</code> or <code>[****T****]</code>
 * <li><code>! g.disjoint(this)</code> (<code>intersects</code> is the
 * inverse of <code>disjoint</code>)
 * </ul>
 *
 * @param {Geometry}
 *          g the <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @return {boolean} <code>true</code> if the two <code>Geometry</code>s
 *         intersect.
 *
 * @see Geometry#disjoint
 */
jsts.geom.Geometry.prototype.intersects = function(g) {

  // short-circuit envelope test
  if (!this.getEnvelopeInternal().intersects(g.getEnvelopeInternal())) {
    return false;
  }

  /**
   * TODO: (MD) Add optimizations: - for P-A case: If P is in env(A), test for
   * point-in-poly - for A-A case: If env(A1).overlaps(env(A2)) test for
   * overlaps via point-in-poly first (both ways) Possibly optimize selection of
   * point to test by finding point of A1 closest to centre of env(A2). (Is
   * there a test where we shouldn't bother - e.g. if env A is much smaller than
   * env B, maybe there's no point in testing pt(B) in env(A)?
   */

  // optimization for rectangle arguments
  if (this.isRectangle()) {
    return RectangleIntersects.intersects(this, g);
  }
  if (g.isRectangle()) {
    return RectangleIntersects.intersects(g, this);
  }
  // general case
  return this.relate(g).isIntersects();
};


/**
 * Tests whether this geometry crosses the specified geometry.
 * <p>
 * The <code>crosses</code> predicate has the following equivalent
 * definitions:
 * <ul>
 * <li>The geometries have some but not all interior points in common.
 * <li>The DE-9IM Intersection Matrix for the two geometries matches
 * <ul>
 * <li><code>[T*T******]</code> (for P/L, P/A, and L/A situations)
 * <li><code>[T*****T**]</code> (for L/P, A/P, and A/L situations)
 * <li><code>[0********]</code> (for L/L situations)
 * </ul>
 * </ul>
 * For any other combination of dimensions this predicate returns
 * <code>false</code>.
 * <p>
 * The SFS defined this predicate only for P/L, P/A, L/L, and L/A situations.
 * JTS extends the definition to apply to L/P, A/P and A/L situations as well,
 * in order to make the relation symmetric.
 *
 * @param {Geometry}
 *          g the <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @return {boolean} <code>true</code> if the two <code>Geometry</code>s
 *         cross.
 */
jsts.geom.Geometry.prototype.crosses = function(g) {
  // short-circuit test
  if (!this.getEnvelopeInternal().intersects(g.getEnvelopeInternal())) {
    return false;
  }
  return this.relate(g).isCrosses(this.getDimension(), g.getDimension());
};


/**
 * Tests whether this geometry is within the specified geometry.
 * <p>
 * The <code>within</code> predicate has the following equivalent definitions:
 * <ul>
 * <li>Every point of this geometry is a point of the other geometry, and the
 * interiors of the two geometries have at least one point in common.
 * <li>The DE-9IM Intersection Matrix for the two geometries matches
 * <code>[T*F**F***]</code>
 * <li><code>g.contains(this)</code> (<code>within</code> is the converse
 * of <code>contains</code>)
 * </ul>
 * An implication of the definition is that "The boundary of a Geometry is not
 * within the Geometry". In other words, if a geometry A is a subset of the
 * points in the boundary of a geomtry B, <code>A.within(B) = false</code>
 *
 * @param {Geometry}
 *          g the <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @return {boolean} <code>true</code> if this <code>Geometry</code> is
 *         within <code>other.</code>
 *
 * @see Geometry#contains
 */
jsts.geom.Geometry.prototype.within = function(g) {
  return g.contains(this);
};


/**
 * Tests whether this geometry contains the specified geometry.
 * <p>
 * The <code>contains</code> predicate has the following equivalent
 * definitions:
 * <ul>
 * <li>Every point of the other geometry is a point of this geometry, and the
 * interiors of the two geometries have at least one point in common.
 * <li>The DE-9IM Intersection Matrix for the two geometries matches
 * <code>[T*****FF*]</code>
 * <li><code>g.within(this)</code> (<code>contains</code> is the converse
 * of <code>within</code>)
 * </ul>
 * An implication of the definition is that "Geometries do not contain their
 * boundary". In other words, if a geometry A is a subset of the points in the
 * boundary of a geometry B, <code>B.contains(A) = false</code>
 *
 * @param {Geometry}
 *          g the <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @return {boolean} <code>true</code> if this <code>Geometry</code>
 *         contains <code>g.</code>
 *
 * @see Geometry#within
 */
jsts.geom.Geometry.prototype.contains = function(g) {
  // short-circuit test
  if (!this.getEnvelopeInternal().contains(g.getEnvelopeInternal())) {
    return false;
  }
  // optimization for rectangle arguments
  if (this.isRectangle()) {
    return RectangleContains.contains(this, g);
  }
  // general case
  return this.relate(g).isContains();
};


/**
 * Tests whether this geometry overlaps the specified geometry.
 * <p>
 * The <code>overlaps</code> predicate has the following equivalent
 * definitions:
 * <ul>
 * <li>The geometries have at least one point each not shared by the other (or
 * equivalently neither covers the other), they have the same dimension, and the
 * intersection of the interiors of the two geometries has the same dimension as
 * the geometries themselves.
 * <li>The DE-9IM Intersection Matrix for the two geometries matches
 * <code>[T*T***T**]</code> (for two points or two surfaces) or
 * <code>[1*T***T**]</code> (for two curves)
 * </ul>
 * If the geometries are of different dimension this predicate returns
 * <code>false</code>.
 *
 * @param {Geometry}
 *          g the <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @return {boolean} <code>true</code> if the two <code>Geometry</code>s
 *         overlap.
 */
jsts.geom.Geometry.prototype.overlaps = function(g) {
  // short-circuit test
  if (!this.getEnvelopeInternal().intersects(g.getEnvelopeInternal())) {
    return false;
  }
  return this.relate(g).isOverlaps(this.getDimension(), g.getDimension());
};


/**
 * Tests whether this geometry covers the specified geometry.
 * <p>
 * The <code>covers</code> predicate has the following equivalent definitions:
 * <ul>
 * <li>Every point of the other geometry is a point of this geometry.
 * <li>The DE-9IM Intersection Matrix for the two geometries matches
 * <code>[T*****FF*]</code> or <code>[*T****FF*]</code> or
 * <code>[***T**FF*]</code> or <code>[****T*FF*]</code>
 * <li><code>g.coveredBy(this)</code> (<code>covers</code> is the converse
 * of <code>coveredBy</code>)
 * </ul>
 * If either geometry is empty, the value of this predicate is <tt>false</tt>.
 * <p>
 * This predicate is similar to {@link #contains}, but is more inclusive (i.e.
 * returns <tt>true</tt> for more cases). In particular, unlike
 * <code>contains</code> it does not distinguish between points in the
 * boundary and in the interior of geometries. For most situations,
 * <code>covers</code> should be used in preference to <code>contains</code>.
 * As an added benefit, <code>covers</code> is more amenable to optimization,
 * and hence should be more performant.
 *
 * @param {Geometry}
 *          g the <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @return {boolean} <code>true</code> if this <code>Geometry</code> covers
 *         <code>g.</code>
 *
 * @see Geometry#contains
 * @see Geometry#coveredBy
 */
jsts.geom.Geometry.prototype.covers = function(g) {
  // short-circuit test
  if (!this.getEnvelopeInternal().covers(g.getEnvelopeInternal())) {
    return false;
  }
  // optimization for rectangle arguments
  if (this.isRectangle()) {
    // since we have already tested that the test envelope is covered
    return true;
  }
  return this.relate(g).isCovers();
};


/**
 * Tests whether this geometry is covered by the specified geometry.
 * <p>
 * The <code>coveredBy</code> predicate has the following equivalent
 * definitions:
 * <ul>
 * <li>Every point of this geometry is a point of the other geometry.
 * <li>The DE-9IM Intersection Matrix for the two geometries matches
 * <code>[T*F**F***]</code> or <code>[*TF**F***]</code> or
 * <code>[**FT*F***]</code> or <code>[**F*TF***]</code>
 * <li><code>g.covers(this)</code> (<code>coveredBy</code> is the converse
 * of <code>covers</code>)
 * </ul>
 * If either geometry is empty, the value of this predicate is <tt>false</tt>.
 * <p>
 * This predicate is similar to {@link #within}, but is more inclusive (i.e.
 * returns <tt>true</tt> for more cases).
 *
 * @param {Geometry}
 *          g the <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @return {boolean} <code>true</code> if this <code>Geometry</code> is
 *         covered by <code>g.</code>
 *
 * @see Geometry#within
 * @see Geometry#covers
 */
jsts.geom.Geometry.prototype.coveredBy = function(g) {
  return g.covers(this);
};


/**
 * Tests whether the elements in the DE-9IM {@link IntersectionMatrix} for the
 * two <code>Geometry</code>s match the elements in
 * <code>intersectionPattern</code>. The pattern is a 9-character string,
 * with symbols drawn from the following set:
 * <UL>
 * <LI> 0 (dimension 0)
 * <LI> 1 (dimension 1)
 * <LI> 2 (dimension 2)
 * <LI> T ( matches 0, 1 or 2)
 * <LI> F ( matches FALSE)
 * <LI> * ( matches any value)
 * </UL>
 * For more information on the DE-9IM, see the <i>OpenGIS Simple Features
 * Specification</i>.
 *
 * @param {Geometry}
 *          other the <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @param {string}
 *          intersectionPattern the pattern against which to check the
 *          intersection matrix for the two <code>Geometry</code>s.
 * @return {boolean} <code>true</code> if the DE-9IM intersection matrix for
 *         the two <code>Geometry</code>s match
 *         <code>intersectionPattern.</code>
 * @see IntersectionMatrix
 */
jsts.geom.Geometry.prototype.relate = function(g, intersectionPattern) {
  if (arguments.length === 1) {
    return this.relate2.apply(this, arguments);
  }

  return this.relate2(g).matches(intersectionPattern);
};


/**
 * Returns the DE-9IM {@link IntersectionMatrix} for the two
 * <code>Geometry</code>s.
 *
 * @param {Geometry}
 *          g the <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @return {IntersectionMatrix} an {@link IntersectionMatrix} describing the
 *         intersections of the interiors, boundaries and exteriors of the two
 *         <code>Geometry</code>s.
 */
jsts.geom.Geometry.prototype.relate2 = function(g) {
  this.checkNotGeometryCollection(this);
  this.checkNotGeometryCollection(g);
  return jsts.operation.relate.RelateOp.relate(this, g);
};


/**
 * Tests whether this geometry is topologically equal to the argument geometry
 * as defined by the SFS <tt>equals</tt> predicate.
 * <p>
 * The SFS <code>equals</code> predicate has the following equivalent
 * definitions:
 * <ul>
 * <li>The two geometries have at least one point in common, and no point of
 * either geometry lies in the exterior of the other geometry.
 * <li>The DE-9IM Intersection Matrix for the two geometries matches the
 * pattern <tt>T*F**FFF*</tt>
 * <pre>
 * T*F
 * **F
 * FF*
 * </pre>
 *
 * </ul>
 * <b>Note</b> that this method computes <b>topologically equality</b>. For
 * structural equality, see {@link #equalsExact(Geometry)}.
 *
 * @param {Geometry}
 *          g the <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @return {boolean} <code>true</code> if the two <code>Geometry</code>s
 *         are topologically equal.
 *
 * @see #equalsExact(Geometry)
 */
jsts.geom.Geometry.prototype.equalsTopo = function(g) {
  // short-circuit test
  if (!this.getEnvelopeInternal().equals(g.getEnvelopeInternal())) {
    return false;
  }
  return this.relate(g).isEquals(this.getDimension(), g.getDimension());
};


/**
 * Tests whether this geometry is structurally and numerically equal to a given
 * <tt>Object</tt>. If the argument <tt>Object</tt> is not a
 * <tt>Geometry</tt>, the result is <tt>false</tt>. Otherwise, the result
 * is computed using {@link #equalsExact(Geometry)}.
 * <p>
 * This method is provided to fulfill the Java contract for value-based object
 * equality. In conjunction with {@link #hashCode()} it provides semantics which
 * are most useful for using <tt>Geometry</tt>s as keys and values in Java
 * collections.
 * <p>
 * Note that to produce the expected result the input geometries should be in
 * normal form. It is the caller's responsibility to perform this where required
 * (using {@link Geometry#norm() or {@link #normalize()} as appropriate).
 *
 * @param {Object}
 *          o the Object to compare.
 * @return {boolean} true if this geometry is exactly equal to the argument.
 *
 * @see #equalsExact(Geometry)
 * @see #hashCode()
 * @see #norm()
 * @see #normalize()
 */
jsts.geom.Geometry.prototype.equals = function(o) {
  if (o instanceof jsts.geom.Geometry ||
      o instanceof jsts.geom.LinearRing ||
      o instanceof jsts.geom.Polygon ||
      o instanceof jsts.geom.GeometryCollection ||
      o instanceof jsts.geom.MultiPoint ||
      o instanceof jsts.geom.MultiLineString ||
      o instanceof jsts.geom.MultiPolygon) {
    return this.equalsExact(o);
  }
  return false;
};


/**
 * Tests whether this geometry is topologically equal to the argument geometry
 * as defined by the SFS <tt>equals</tt> predicate.
 * <p>
 * The SFS <code>equals</code> predicate has the following equivalent
 * definitions:
 * <ul>
 * <li>The two geometries have at least one point in common, and no point of
 * either geometry lies in the exterior of the other geometry.
 * <li>The DE-9IM Intersection Matrix for the two geometries matches the
 * pattern <tt>T*F**FFF*</tt>
 * <pre>
 * T*F
 * **F
 * FF*
 * </pre>
 *
 * </ul>
 * <b>Note</b> that this method computes <b>topologically equality</b>. For
 * structural equality, see {@link #equalsExact(Geometry)}.
 *
 * @param {Geometry}
 *          g the <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @return {boolean} <code>true</code> if the two <code>Geometry</code>s are
 *                  topologically equal.
 *
 * @see #equalsExact(Geometry)
 */
jsts.geom.Geometry.prototype.equalsTopo = function(g) {
  // short-circuit test
  if (!this.getEnvelopeInternal().equals(g.getEnvelopeInternal()))
    return false;
  return this.relate(g).isEquals(getDimension(), g.getDimension());
};


/**
 * Computes a buffer area around this geometry having the given width and with a
 * specified accuracy of approximation for circular arcs, and using a specified
 * end cap style.
 * <p>
 * Mathematically-exact buffer area boundaries can contain circular arcs. To
 * represent these arcs using linear geometry they must be approximated with
 * line segments. The <code>quadrantSegments</code> argument allows
 * controlling the accuracy of the approximation by specifying the number of
 * line segments used to represent a quadrant of a circle
 * <p>
 * The end cap style specifies the buffer geometry that will be created at the
 * ends of linestrings. The styles provided are:
 * <ul>
 * <li><tt>BufferOp.CAP_ROUND</tt> - (default) a semi-circle
 * <li><tt>BufferOp.CAP_BUTT</tt> - a straight line perpendicular to the end
 * segment
 * <li><tt>BufferOp.CAP_SQUARE</tt> - a half-square
 * </ul>
 * <p>
 * The buffer operation always returns a polygonal result. The negative or
 * zero-distance buffer of lines and points is always an empty {@link Polygon}.
 * This is also the result for the buffers of degenerate (zero-area) polygons.
 *
 * @param {double}
 *          distance the width of the buffer (may be positive, negative or 0).
 * @param {int}
 *          quadrantSegments the number of line segments used to represent a
 *          quadrant of a circle.
 * @param {int}
 *          endCapStyle the end cap style to use.
 * @return {Geometry} a polygonal geometry representing the buffer region (which
 *         may be empty).
 *
 * @throws TopologyException
 *           if a robustness error occurs
 *
 * @see #buffer(double)
 * @see #buffer(double, int)
 * @see BufferOp
 */
jsts.geom.Geometry.prototype.buffer = function(distance, quadrantSegments,
    endCapStyle) {
  return jsts.operation.buffer.BufferOp.bufferOp(this, distance,
      quadrantSegments, endCapStyle);
};


/**
 * Computes the smallest convex <code>Polygon</code> that contains all the
 * points in the <code>Geometry</code>. This obviously applies only to
 * <code>Geometry</code> s which contain 3 or more points; the results for
 * degenerate cases are specified as follows: <TABLE>
 * <TR>
 * <TH> Number of <code>Point</code>s in argument <code>Geometry</code>
 * </TH>
 * <TH> <code>Geometry</code> class of result </TH>
 * </TR>
 * <TR>
 * <TD> 0 </TD>
 * <TD> empty <code>GeometryCollection</code> </TD>
 * </TR>
 * <TR>
 * <TD> 1 </TD>
 * <TD> <code>Point</code> </TD>
 * </TR>
 * <TR>
 * <TD> 2 </TD>
 * <TD> <code>LineString</code> </TD>
 * </TR>
 * <TR>
 * <TD> 3 or more </TD>
 * <TD> <code>Polygon</code> </TD>
 * </TR>
 * </TABLE>
 *
 * @return {Geometry} the minimum-area convex polygon containing this
 *         <code>Geometry</code>' s points.
 */
jsts.geom.Geometry.prototype.convexHull = function() {
  return (new ConvexHull(this)).getConvexHull();
};


/**
 * Computes a <code>Geometry</code> representing the points shared by this
 * <code>Geometry</code> and <code>other</code>. {@link GeometryCollection}s
 * support intersection with homogeneous collection types, with the semantics
 * that the result is a {@link GeometryCollection} of the intersection of each
 * element of the target with the argument.
 *
 * @param {Geometry}
 *          other the <code>Geometry</code> with which to compute the
 *          intersection.
 * @return {Geometry} the points common to the two <code>Geometry</code>s.
 * @throws TopologyException
 *           if a robustness error occurs
 * @throws IllegalArgumentException
 *           if the argument is a non-empty GeometryCollection
 */
jsts.geom.Geometry.prototype.intersection = function(other) {
  /**
   * TODO: MD - add optimization for P-A case using Point-In-Polygon
   */
  // special case: if one input is empty ==> empty
  if (this.isEmpty()) {
    return this.getFactory().createGeometryCollection(null);
  }
  if (other.isEmpty()) {
    return this.getFactory().createGeometryCollection(null);
  }

  // compute for GCs
  if (this.isGeometryCollection(this)) {
    var g2 = other;
    // TODO: probably not straightforward to port...
    /*
     * return GeometryCollectionMapper.map(this, new
     * GeometryCollectionMapper.MapOp() { public Geometry map(Geometry g) {
     * return g.intersection(g2); } });
     */
  }

  this.checkNotGeometryCollection(this);
  this.checkNotGeometryCollection(other);
  return SnapIfNeededOverlayOp.overlayOp(this, other, OverlayOp.INTERSECTION);
};


/**
 * Computes a <code>Geometry</code> representing all the points in this
 * <code>Geometry</code> and <code>other</code>.
 *
 * @param {Geometry}
 *          other the <code>Geometry</code> with which to compute the union.
 * @return {Geometry} a set combining the points of this <code>Geometry</code>
 *         and the points of <code>other.</code>
 * @throws TopologyException
 *           if a robustness error occurs
 * @throws IllegalArgumentException
 *           if either input is a non-empty GeometryCollection
 */
jsts.geom.Geometry.prototype.union = function(other) {
  // special case: if either input is empty ==> other input
  if (this.isEmpty()) {
    return other.clone();
  }
  if (other.isEmpty()) {
    return this.clone();
  }

  // TODO: optimize if envelopes of geometries do not intersect

  this.checkNotGeometryCollection(this);
  this.checkNotGeometryCollection(other);
  return SnapIfNeededOverlayOp.overlayOp(this, other, OverlayOp.UNION);
};


/**
 * Computes a <code>Geometry</code> representing the points making up this
 * <code>Geometry</code> that do not make up <code>other</code>. This
 * method returns the closure of the resultant <code>Geometry</code>.
 *
 * @param {Geometry}
 *          other the <code>Geometry</code> with which to compute the
 *          difference.
 * @return {Geometry} the point set difference of this <code>Geometry</code>
 *         with <code>other.</code>
 * @throws TopologyException
 *           if a robustness error occurs
 * @throws IllegalArgumentException
 *           if either input is a non-empty GeometryCollection
 */
jsts.geom.Geometry.prototype.difference = function(other) {
  // mod to handle empty cases better - return type of input
  // if (this.isEmpty() || other.isEmpty()) return (Geometry) clone();

  // special case: if A.isEmpty ==> empty; if B.isEmpty ==> A
  if (this.isEmpty()) {
    return this.getFactory().createGeometryCollection(null);
  }
  if (other.isEmpty()) {
    return this.clone();
  }

  this.heckNotGeometryCollection(this);
  this.checkNotGeometryCollection(other);
  return SnapIfNeededOverlayOp.overlayOp(this, other, OverlayOp.DIFFERENCE);
};


/**
 * Returns a set combining the points in this <code>Geometry</code> not in
 * <code>other</code>, and the points in <code>other</code> not in this
 * <code>Geometry</code>. This method returns the closure of the resultant
 * <code>Geometry</code>.
 *
 * @param {Geometry}
 *          other the <code>Geometry</code> with which to compute the
 *          symmetric difference.
 * @return {Geometry} the point set symmetric difference of this
 *         <code>Geometry</code> with <code>other.</code>
 * @throws TopologyException
 *           if a robustness error occurs
 * @throws IllegalArgumentException
 *           if either input is a non-empty GeometryCollection
 */
jsts.geom.Geometry.prototype.symDifference = function(other) {
  // special case: if either input is empty ==> other input
  if (this.isEmpty()) {
    return other.clone();
  }
  if (other.isEmpty()) {
    return this.clone();
  }

  this.checkNotGeometryCollection(this);
  this.checkNotGeometryCollection(other);
  return SnapIfNeededOverlayOp.overlayOp(this, other, OverlayOp.SYMDIFFERENCE);
};


/**
 * Computes the union of all the elements of this geometry. Heterogeneous
 * {@link GeometryCollection}s are fully supported.
 *
 * The result obeys the following contract:
 * <ul>
 * <li>Unioning a set of {@link LineString}s has the effect of fully noding
 * and dissolving the linework.
 * <li>Unioning a set of {@link Polygon}s will always return a
 * {@link Polygonal} geometry (unlike {link #union(Geometry)}, which may return
 * geometrys of lower dimension if a topology collapse occurred.
 * </ul>
 *
 * @return {Geometry} the union.
 *
 * @see UnaryUnionOp
 */
jsts.geom.Geometry.prototype.union = function() {
  return jsts.operation.union.UnaryUnionOp.union(this);
};


/**
 * Returns true if the two <code>Geometry</code>s are exactly equal, up to a
 * specified distance tolerance. Two Geometries are exactly equal within a
 * distance tolerance if and only if:
 * <ul>
 * <li>they have the same class
 * <li>they have the same values for their vertices, within the given tolerance
 * distance, in exactly the same order.
 * </ul>
 * If this and the other <code>Geometry</code>s are composites and any
 * children are not <code>Geometry</code>s, returns <code>false</code>.
 *
 * @param {Geometry}
 *          other the <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @param {double}
 *          tolerance distance at or below which two <code>Coordinate</code>s
 *          are considered equal.
 */
jsts.geom.Geometry.prototype.equalsExact = function(other, tolerance) {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * Performs an operation with or on this <code>Geometry</code> and its
 * subelement <code>Geometry</code>s (if any). Only GeometryCollections and
 * subclasses have subelement Geometry's.
 *
 * @param filter
 *          the filter to apply to this <code>Geometry</code> (and its
 *          children, if it is a <code>GeometryCollection</code>).
 */
jsts.geom.Geometry.prototype.apply = function(filter) {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * Creates and returns a full copy of this {@link Geometry} object (including
 * all coordinates contained by it). Subclasses are responsible for overriding
 * this method and copying their internal data. Overrides should call this
 * method first.
 *
 * TODO: I guess the purpose for subclasses is to copy the envelope but won't
 * work for js since it relies on casting. Have to revisit this code and decide
 * what to do.
 *
 * @return {Object} a clone of this instance.
 */
jsts.geom.Geometry.prototype.clone = function() {
  var clone = new jsts.geom.Geometry(this.factory);
  if (clone.envelope !== null) {
    clone.envelope = new jsts.geom.Envelope(clone.envelope);
  }
  return clone;
};


/**
 * Converts this <code>Geometry</code> to <b>normal form</b> (or <b>
 * canonical form</b> ). Normal form is a unique representation for
 * <code>Geometry</code> s. It can be used to test whether two
 * <code>Geometry</code>s are equal in a way that is independent of the
 * ordering of the coordinates within them. Normal form equality is a stronger
 * condition than topological equality, but weaker than pointwise equality. The
 * definitions for normal form use the standard lexicographical ordering for
 * coordinates. "Sorted in order of coordinates" means the obvious extension of
 * this ordering to sequences of coordinates.
 */
jsts.geom.Geometry.prototype.normalize = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * Returns whether this <code>Geometry</code> is greater than, equal to, or
 * less than another <code>Geometry</code>.
 * <P>
 *
 * If their classes are different, they are compared using the following
 * ordering:
 * <UL>
 * <LI> Point (lowest)
 * <LI> MultiPoint
 * <LI> LineString
 * <LI> LinearRing
 * <LI> MultiLineString
 * <LI> Polygon
 * <LI> MultiPolygon
 * <LI> GeometryCollection (highest)
 * </UL>
 * If the two <code>Geometry</code>s have the same class, their first
 * elements are compared. If those are the same, the second elements are
 * compared, etc.
 *
 * @param {Geometry}
 *          other a <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @return {int} a positive number, 0, or a negative number, depending on
 *         whether this object is greater than, equal to, or less than
 *         <code>o</code>, as defined in "Normal Form For Geometry" in the
 *         JTS Technical Specifications.
 */
jsts.geom.Geometry.prototype.compareTo = function(other) {
  if (this.getClassSortIndex() !== other.getClassSortIndex()) {
    return this.getClassSortIndex() - other.getClassSortIndex();
  }
  if (this.isEmpty() && other.isEmpty()) {
    return 0;
  }
  if (this.isEmpty()) {
    return -1;
  }
  if (other.isEmpty()) {
    return 1;
  }
  return this.compareToSameClass(o);
};


/**
 * Returns whether this <code>Geometry</code> is greater than, equal to, or
 * less than another <code>Geometry</code>, using the given
 * {@link CoordinateSequenceComparator}.
 * <P>
 *
 * If their classes are different, they are compared using the following
 * ordering:
 * <UL>
 * <LI> Point (lowest)
 * <LI> MultiPoint
 * <LI> LineString
 * <LI> LinearRing
 * <LI> MultiLineString
 * <LI> Polygon
 * <LI> MultiPolygon
 * <LI> GeometryCollection (highest)
 * </UL>
 * If the two <code>Geometry</code>s have the same class, their first
 * elements are compared. If those are the same, the second elements are
 * compared, etc.
 *
 * @param {Geometry}
 *          other a <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @param {CoordinateSequenceComparator}
 *          comp a <code>CoordinateSequenceComparator.</code>
 *
 * @return {int} a positive number, 0, or a negative number, depending on
 *         whether this object is greater than, equal to, or less than
 *         <code>o</code>, as defined in "Normal Form For Geometry" in the
 *         JTS Technical Specifications.
 */
jsts.geom.Geometry.prototype.compareTo = function(other, comp) {
  if (this.getClassSortIndex() !== other.getClassSortIndex()) {
    return this.getClassSortIndex() - other.getClassSortIndex();
  }
  if (this.isEmpty() && other.isEmpty()) {
    return 0;
  }
  if (this.isEmpty()) {
    return -1;
  }
  if (other.isEmpty()) {
    return 1;
  }
  return this.compareToSameClass(o, comp);
};


/**
 * Returns whether the two <code>Geometry</code>s are equal, from the point
 * of view of the <code>equalsExact</code> method. Called by
 * <code>equalsExact</code> . In general, two <code>Geometry</code> classes
 * are considered to be "equivalent" only if they are the same class. An
 * exception is <code>LineString</code> , which is considered to be equivalent
 * to its subclasses.
 *
 * @param {Geometry}
 *          other the <code>Geometry</code> with which to compare this
 *          <code>Geometry</code> for equality.
 * @return {Boolean} <code>true</code> if the classes of the two
 *         <code>Geometry</code> s are considered to be equal by the
 *         <code>equalsExact</code> method.
 */
jsts.geom.Geometry.prototype.isEquivalentClass = function(other) {
  // TODO: handle exception for LineString as described above.
  return other instanceof this.constructor;
};


/**
 * Throws an exception if <code>g</code>'s class is
 * <code>GeometryCollection</code> . (Its subclasses do not trigger an
 * exception).
 *
 * @param {Geometry}
 *          g the <code>Geometry</code> to check.
 * @throws Error
 *           if <code>g</code> is a <code>GeometryCollection</code> but not
 *           one of its subclasses
 */
jsts.geom.Geometry.prototype.checkNotGeometryCollection = function(g) {
  if (g instanceof jsts.geom.GeometryCollection) {
    throw new jsts.error.IllegalArgumentError(
        'This method does not support GeometryCollection');
  }
};


/**
 *
 * @return {Boolean} true if this is a GeometryCollection.
 */
jsts.geom.Geometry.prototype.isGeometryCollection = function() {
  return (this instanceof jsts.geom.GeometryCollection);
};


/**
 * Returns the minimum and maximum x and y values in this <code>Geometry</code>,
 * or a null <code>Envelope</code> if this <code>Geometry</code> is empty.
 * Unlike <code>getEnvelopeInternal</code>, this method calculates the
 * <code>Envelope</code> each time it is called;
 * <code>getEnvelopeInternal</code> caches the result of this method.
 *
 * @return {Envelope} this <code>Geometry</code>s bounding box; if the
 *         <code>Geometry</code> is empty, <code>Envelope#isNull</code> will
 *         return <code>true.</code>
 */
jsts.geom.Geometry.prototype.computeEnvelopeInternal = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * Returns whether this <code>Geometry</code> is greater than, equal to, or
 * less than another <code>Geometry</code> having the same class.
 *
 * @param {Geometry}
 *          o a <code>Geometry</code> having the same class as this
 *          <code>Geometry.</code>
 * @return {int} a positive number, 0, or a negative number, depending on
 *         whether this object is greater than, equal to, or less than
 *         <code>o</code>, as defined in "Normal Form For Geometry" in the
 *         JTS Technical Specifications.
 */
jsts.geom.Geometry.prototype.compareToSameClass = function(o) {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * Returns whether this <code>Geometry</code> is greater than, equal to, or
 * less than another <code>Geometry</code> of the same class. using the given
 * {@link CoordinateSequenceComparator}.
 *
 * @param {Geometry}
 *          o a <code>Geometry</code> having the same class as this
 *          <code>Geometry.</code>
 * @param {CoordinateSequenceComparator}
 *          comp a <code>CoordinateSequenceComparator.</code>
 * @return {int} a positive number, 0, or a negative number, depending on
 *         whether this object is greater than, equal to, or less than
 *         <code>o</code>, as defined in "Normal Form For Geometry" in the
 *         JTS Technical Specifications.
 */
jsts.geom.Geometry.prototype.compareToSameClass = function(o, comp) {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * Returns the first non-zero result of <code>compareTo</code> encountered as
 * the two <code>Collection</code>s are iterated over. If, by the time one of
 * the iterations is complete, no non-zero result has been encountered, returns
 * 0 if the other iteration is also complete. If <code>b</code> completes
 * before <code>a</code>, a positive number is returned; if a before b, a
 * negative number.
 *
 * @param {Collection}
 *          a a <code>Collection</code> of <code>Comparable</code>s.
 * @param {Collection}
 *          b a <code>Collection</code> of <code>Comparable</code>s.
 * @return {int} the first non-zero <code>compareTo</code> result, if any;
 *         otherwise, zero.
 */
jsts.geom.Geometry.prototype.compare = function(a, b) {
  var i = a.iterator();
  var j = b.iterator();
  while (i.hasNext() && j.hasNext()) {
    var aElement = i.next();
    var bElement = j.next();
    var comparison = aElement.compareTo(bElement);
    if (comparison !== 0) {
      return comparison;
    }
  }
  if (i.hasNext()) {
    return 1;
  }
  if (j.hasNext()) {
    return -1;
  }
  return 0;
};


/**
 * @param {jsts.geom.Coordinate}
 *          a first Coordinate to compare.
 * @param {jsts.geom.Coordinate}
 *          b second Coordinate to compare.
 * @param {double}
 *          tolerance tolerance when comparing.
 * @return {Boolean} true if equal.
 */
jsts.geom.Geometry.prototype.equal = function(a, b, tolerance) {
  if (tolerance === undefined || tolerance === null || tolerance === 0) {
    return a.equals(b);
  }
  return a.distance(b) <= tolerance;
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geom/Geometry.js
 */



/**
 * @constructor
 * @augments OpenLayers.Geometry.Collection
 * @augments jsts.geom.Geometry
 */
jsts.geom.GeometryCollection = function() {
};

jsts.geom.GeometryCollection = OpenLayers.Class(jsts.geom.Geometry);


/**
 * @return {boolean}
 */
jsts.geom.GeometryCollection.prototype.isEmpty = function() {
  for (var i = 0; i < this.geometries.length; i++) {
    if (!this.geometries[i].isEmpty()) {
      return false;
    }
  }
  return true;
};


/**
 * @return {int}
 */
jsts.geom.GeometryCollection.prototype.getNumGeometries = function() {
  return this.geometries.length;
};


/**
 * @param {int} n
 * @return {Geometry}
 */
jsts.geom.GeometryCollection.prototype.getGeometryN = function(n) {
  return this.geometries[n];
};


/**
 * @param {Geometry} other
 * @param {double} tolerance
 * @return {boolean}
 */
jsts.geom.GeometryCollection.prototype.equalsExact = function(other,  tolerance) {
  if (!this.isEquivalentClass(other)) {
    return false;
  }
  if (this.geometries.length !== other.geometries.length) {
    return false;
  }
  for (var i = 0; i < this.geometries.length; i++) {
    if (!(this.geometries[i]).equalsExact(other.geometries[i], tolerance)) {
      return false;
    }
  }
  return true;
};

jsts.geom.GeometryCollection.prototype.apply = function(filter) {
  filter.filter(this);
  for (var i = 0; i < this.geometries.length; i++) {
    this.geometries[i].apply(filter);
  }
};


jsts.geom.GeometryCollection.prototype.getDimension = function() {
  var dimension = jsts.geom.Dimension.FALSE;
  for (var i = 0; i < this.geometries.length; i++) {
    var geometry = this.geometries[i];
    // NOTE: special handling since in JTS the parts would be Points.
    if (geometry instanceof jsts.geom.Coordinate) {
      Math.max(dimension, 0);
    } else {
      dimension = Math.max(dimension, geometry.getDimension());
    }

  }
  return dimension;
};


/**
 * @protected
 */
jsts.geom.GeometryCollection.prototype.computeEnvelopeInternal = function() {
  var envelope = new jsts.geom.Envelope();
  for (var i = 0; i < this.geometries.length; i++) {
    var geometry = this.geometries[i];
    // NOTE: special handling since in JTS the parts would be Points.
    if (geometry instanceof jsts.geom.Coordinate) {
      envelope.expandToInclude(new jsts.geom.Envelope(geometry));
    } else {
      envelope.expandToInclude(geometry.getEnvelopeInternal());
    }
  }
  return envelope;
};

OpenLayers.Geometry.Collection = OpenLayers.Class(
    OpenLayers.Geometry.Collection, jsts.geom.GeometryCollection, {
      initialize: function(components) {
        OpenLayers.Geometry.prototype.initialize.apply(this, arguments);
        this.components = [];
        if (components != null) {
          this.addComponents(components);
        }
        this.geometries = this.components;
      }
    });
jsts.geom.GeometryCollection = OpenLayers.Geometry.Collection;

// TODO: port rest

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


/**
 * <code>GeometryCollection</code> classes support the concept of applying a
 * <code>GeometryFilter</code> to the <code>Geometry</code>. The filter is
 * applied to every element <code>Geometry</code>. A
 * <code>GeometryFilter</code> can either record information about the
 * <code>Geometry</code> or change the <code>Geometry</code> in some way.
 * <code>GeometryFilter</code> is an example of the Gang-of-Four Visitor
 * pattern.
 */
jsts.geom.GeometryFilter = function() {
};


/**
 * Performs an operation with or on <code>geom</code>.
 *
 * @param {Geometry}
 *          geom a <code>Geometry</code> to which the filter is applied.
 */
jsts.geom.GeometryFilter.prototype.filter = function(geom) {
  throw new jsts.error.AbstractMethodInvocationError();
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


/**
 * <code>Geometry</code> classes support the concept of applying a
 * <code>GeometryComponentFilter</code> filter to the <code>Geometry</code>.
 * The filter is applied to every component of the <code>Geometry</code> which
 * is itself a <code>Geometry</code> and which does not itself contain any
 * components. (For instance, all the {@link LinearRing}s in {@link Polygon}s
 * are visited, but in a {@link MultiPolygon} the {@link Polygon}s themselves
 * are not visited.) Thus the only classes of Geometry which must be handled as
 * arguments to {@link #filter} are {@link LineString}s, {@link LinearRing}s
 * and {@link Point}s.
 * <p>
 * A <code>GeometryComponentFilter</code> filter can either record information
 * about the <code>Geometry</code> or change the <code>Geometry</code> in
 * some way. <code>GeometryComponentFilter</code> is an example of the
 * Gang-of-Four Visitor pattern.
 */
jsts.geom.GeometryComponentFilter = function() {
};


/**
 * Performs an operation with or on <code>geom</code>.
 *
 * @param {Geometry}
 *          geom a <code>Geometry</code> to which the filter is applied.
 */
jsts.geom.GeometryComponentFilter.prototype.filter = function(geom) {
  throw new jsts.error.AbstractMethodInvocationError();
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Models a Dimensionally Extended Nine-Intersection Model (DE-9IM) matrix. This
 * class is used to represent intersection matrices (such as "212FF1FF2")
 * capturing the topological relationship between two {@link Geometry}s. It can
 * also be represent patterns (such as "T*T******")for matching existing
 * matrices.
 *
 * Methods are provided to:
 * <UL>
 * <LI> set and query the elements of the matrix in a convenient fashion
 * <LI> convert to and from the standard string representation (specified in SFS
 * Section 2.1.13.2).
 * <LI> test to see if a matrix matches a given pattern string.
 * </UL>
 * <P>
 *
 * For a description of the DE-9IM, see the <A
 * HREF="http://www.opengis.org/techno/specs.htm">OpenGIS Simple Features
 * Specification for SQL</A>.
 *
 * The entries of the matrix are defined by the constants in the
 * {@link Dimension} class. The indices of the matrix represent the topological
 * locations that occur in a geometry (Interior, Boundary, Exterior). These are
 * provided as constants in the {@link Location} class.
 *
 * @param {string/IntersectionMatrix}
 *          elements
 * @constructor
 */
jsts.geom.IntersectionMatrix = function(elements) {
  var other = elements;

  if (elements === undefined || elements === null) {
    this.matrix = [[], [], []];
    this.setAll(jsts.geom.Dimension.FALSE);
  } else if (typeof elements === 'string') {
    this.set(elements);
  } else if (other instanceof jsts.geom.IntersectionMatrix) {

    this.matrix[jsts.geom.Location.INTERIOR][jsts.geom.Location.INTERIOR] = other.matrix[jsts.geom.Location.INTERIOR][jsts.geom.Location.INTERIOR];
    this.matrix[jsts.geom.Location.INTERIOR][jsts.geom.Location.BOUNDARY] = other.matrix[jsts.geom.Location.INTERIOR][jsts.geom.Location.BOUNDARY];
    this.matrix[jsts.geom.Location.INTERIOR][jsts.geom.Location.EXTERIOR] = other.matrix[jsts.geom.Location.INTERIOR][jsts.geom.Location.EXTERIOR];
    this.matrix[jsts.geom.Location.BOUNDARY][jsts.geom.Location.INTERIOR] = other.matrix[jsts.geom.Location.BOUNDARY][jsts.geom.Location.INTERIOR];
    this.matrix[jsts.geom.Location.BOUNDARY][jsts.geom.Location.BOUNDARY] = other.matrix[jsts.geom.Location.BOUNDARY][jsts.geom.Location.BOUNDARY];
    this.matrix[jsts.geom.Location.BOUNDARY][jsts.geom.Location.EXTERIOR] = other.matrix[jsts.geom.Location.BOUNDARY][jsts.geom.Location.EXTERIOR];
    this.matrix[jsts.geom.Location.EXTERIOR][jsts.geom.Location.INTERIOR] = other.matrix[jsts.geom.Location.EXTERIOR][jsts.geom.Location.INTERIOR];
    this.matrix[jsts.geom.Location.EXTERIOR][jsts.geom.Location.BOUNDARY] = other.matrix[jsts.geom.Location.EXTERIOR][jsts.geom.Location.BOUNDARY];
    this.matrix[jsts.geom.Location.EXTERIOR][jsts.geom.Location.EXTERIOR] = other.matrix[jsts.geom.Location.EXTERIOR][jsts.geom.Location.EXTERIOR];
  }
};


/**
 * Internal representation of this <code>IntersectionMatrix</code>.
 *
 * @type {int[][]}
 * @private
 */
jsts.geom.IntersectionMatrix.prototype.matrix = null;


/**
 * Adds one matrix to another. Addition is defined by taking the maximum
 * dimension value of each position in the summand matrices.
 *
 * @param {IntersectionMatrix}
 *          im the matrix to add.
 */
jsts.geom.IntersectionMatrix.prototype.add = function(im) {
  var i, j;
  for (i = 0; i < 3; i++) {
    for (j = 0; j < 3; j++) {
      this.setAtLeast(i, j, im.get(i, j));
    }
  }
};


/**
 * Returns true if the dimension value satisfies the dimension symbol.
 *
 * @param {int}
 *          actualDimensionValue a number that can be stored in the
 *          <code>IntersectionMatrix</code> . Possible values are
 *          <code>{TRUE, FALSE, DONTCARE, 0, 1, 2}</code>.
 * @param {string}
 *          requiredDimensionSymbol a character used in the string
 *          representation of an <code>IntersectionMatrix</code>. Possible
 *          values are <code>{T, F, * , 0, 1, 2}</code>.
 * @return {boolean} true if the dimension symbol encompasses the dimension
 *         value.
 */
jsts.geom.IntersectionMatrix.matches = function(actualDimensionValue,
    requiredDimensionSymbol) {
  if (typeof actualDimensionValue === 'string') {
    return jsts.geom.IntersectionMatrix.matches2.call(this, arguments);
  }

  if (requiredDimensionSymbol === '*') {
    return true;
  }
  if (requiredDimensionSymbol === 'T' &&
      (actualDimensionValue >= 0 || actualDimensionValue === jsts.geom.Dimension.TRUE)) {
    return true;
  }
  if (requiredDimensionSymbol === 'F' &&
      actualDimensionValue === jsts.geom.Dimension.FALSE) {
    return true;
  }
  if (requiredDimensionSymbol === '0' &&
      actualDimensionValue === jsts.geom.Dimension.P) {
    return true;
  }
  if (requiredDimensionSymbol === '1' &&
      actualDimensionValue === jsts.geom.Dimension.L) {
    return true;
  }
  if (requiredDimensionSymbol === '2' &&
      actualDimensionValue === jsts.geom.Dimension.A) {
    return true;
  }
  return false;
};


/**
 * Returns true if each of the actual dimension symbols satisfies the
 * corresponding required dimension symbol.
 *
 * @param {string}
 *          actualDimensionSymbols nine dimension symbols to validate. Possible
 *          values are <code>{T, F, * , 0, 1, 2}</code>.
 * @param {string}
 *          requiredDimensionSymbols nine dimension symbols to validate against.
 *          Possible values are <code>{T, F, * , 0, 1, 2}</code>.
 * @return {boolean} true if each of the required dimension symbols encompass
 *         the corresponding actual dimension symbol.
 */
jsts.geom.IntersectionMatrix.matches2 = function(actualDimensionSymbols,
    requiredDimensionSymbols) {
  var m = new jsts.geom.IntersectionMatrix(actualDimensionSymbols);
  return m.matches(requiredDimensionSymbols);
};


/**
 * Changes the value of one of this <code>IntersectionMatrix</code>s
 * elements.
 *
 * @param {int}
 *          row the row of this <code>IntersectionMatrix</code>, indicating
 *          the interior, boundary or exterior of the first
 *          <code>Geometry.</code>
 * @param {int}
 *          column the column of this <code>IntersectionMatrix</code>,
 *          indicating the interior, boundary or exterior of the second
 *          <code>Geometry.</code>
 * @param {int}
 *          dimensionValue the new value of the element.
 */
jsts.geom.IntersectionMatrix.prototype.set = function(row, column,
    dimensionValue) {
  if (typeof row === 'string') {
    this.set2(row);
    return;
  }

  this.matrix[row][column] = dimensionValue;
};


/**
 * Changes the elements of this <code>IntersectionMatrix</code> to the
 * dimension symbols in <code>dimensionSymbols</code>.
 *
 * @param {String}
 *          dimensionSymbols nine dimension symbols to which to set this
 *          <code>IntersectionMatrix</code> s elements. Possible values are
 *          <code>{T, F, * , 0, 1, 2}.</code>
 */
jsts.geom.IntersectionMatrix.prototype.set2 = function(dimensionSymbols) {
  for (var i = 0; i < dimensionSymbols.length(); i++) {
    var row = i / 3;
    var col = i % 3;
    this.matrix[row][col] = jsts.geom.Dimension
        .toDimensionValue(dimensionSymbols.charAt(i));
  }
};


/**
 * Changes the specified element to <code>minimumDimensionValue</code> if the
 * element is less.
 *
 * @param {int}
 *          row the row of this <code>IntersectionMatrix</code> , indicating
 *          the interior, boundary or exterior of the first
 *          <code>Geometry.</code>
 * @param {int}
 *          column the column of this <code>IntersectionMatrix</code> ,
 *          indicating the interior, boundary or exterior of the second
 *          <code>Geometry.</code>
 * @param {int}
 *          minimumDimensionValue the dimension value with which to compare the
 *          element. The order of dimension values from least to greatest is
 *          <code>{DONTCARE, TRUE, FALSE, 0, 1, 2}</code>.
 */
jsts.geom.IntersectionMatrix.prototype.setAtLeast = function(row, column,
    minimumDimensionValue) {
  if (arguments.length === 1) {
    this.setAtLeast2(arguments[0]);
    return;
  }

  if (this.matrix[row][column] < minimumDimensionValue) {
    this.matrix[row][column] = minimumDimensionValue;
  }
};


/**
 * If row >= 0 and column >= 0, changes the specified element to
 * <code>minimumDimensionValue</code> if the element is less. Does nothing if
 * row <0 or column < 0.
 *
 * @param {int}
 *          row the row of this <code>IntersectionMatrix</code> , indicating
 *          the interior, boundary or exterior of the first
 *          <code>Geometry.</code>
 * @param {int}
 *          column the column of this <code>IntersectionMatrix</code> ,
 *          indicating the interior, boundary or exterior of the second
 *          <code>Geometry.</code>
 * @param {int}
 *          minimumDimensionValue the dimension value with which to compare the
 *          element. The order of dimension values from least to greatest is
 *          <code>{DONTCARE, TRUE, FALSE, 0, 1, 2}</code>.
 */
jsts.geom.IntersectionMatrix.prototype.setAtLeastIfValid = function(row,
    column, minimumDimensionValue) {
  if (row >= 0 && column >= 0) {
    this.setAtLeast(row, column, minimumDimensionValue);
  }
};


/**
 * For each element in this <code>IntersectionMatrix</code>, changes the
 * element to the corresponding minimum dimension symbol if the element is less.
 *
 * @param {string}
 *          minimumDimensionSymbols nine dimension symbols with which to compare
 *          the elements of this <code>IntersectionMatrix</code>. The order
 *          of dimension values from least to greatest is
 *          <code>{DONTCARE, TRUE, FALSE, 0, 1, 2}</code> .
 */
jsts.geom.IntersectionMatrix.prototype.setAtLeast2 = function(
    minimumDimensionSymbols) {
  var i;
  for (i = 0; i < minimumDimensionSymbols.length; i++) {
    var row = parseInt(i / 3);
    var col = parseInt(i % 3);
    this.setAtLeast(row, col, jsts.geom.Dimension
        .toDimensionValue(minimumDimensionSymbols.charAt(i)));
  }
};


/**
 * Changes the elements of this <code>IntersectionMatrix</code> to
 * <code>dimensionValue</code> .
 *
 * @param {int}
 *          dimensionValue the dimension value to which to set this
 *          <code>IntersectionMatrix</code> s elements. Possible values
 *          <code>{TRUE, FALSE, DONTCARE, 0, 1, 2}</code> .
 */
jsts.geom.IntersectionMatrix.prototype.setAll = function(dimensionValue) {
  var ai, bi;
  for (ai = 0; ai < 3; ai++) {
    for (bi = 0; bi < 3; bi++) {
      this.matrix[ai][bi] = dimensionValue;
    }
  }
};


/**
 * Returns the value of one of this matrix entries. The value of the provided
 * index is one of the values from the {@link Location} class. The value
 * returned is a constant from the {@link Dimension} class.
 *
 * @param {int}
 *          row the row of this <code>IntersectionMatrix</code>, indicating
 *          the interior, boundary or exterior of the first
 *          <code>Geometry.</code>
 * @param {int}
 *          column the column of this <code>IntersectionMatrix</code>,
 *          indicating the interior, boundary or exterior of the second
 *          <code>Geometry.</code>
 * @return {int} the dimension value at the given matrix position.
 */
jsts.geom.IntersectionMatrix.prototype.get = function(row, column) {
  return this.matrix[row][column];
};


/**
 * Returns <code>true</code> if this <code>IntersectionMatrix</code> is
 * FF*FF****.
 *
 * @return {boolean} <code>true</code> if the two <code>Geometry</code>s
 *         related by this <code>IntersectionMatrix</code> are disjoint.
 */
jsts.geom.IntersectionMatrix.prototype.isDisjoint = function() {
  return this.matrix[jsts.geom.Location.INTERIOR][jsts.geom.Location.INTERIOR] === jsts.geom.Dimension.FALSE &&
      this.matrix[jsts.geom.Location.INTERIOR][jsts.geom.Location.BOUNDARY] === jsts.geom.Dimension.FALSE &&
      this.matrix[jsts.geom.Location.BOUNDARY][jsts.geom.Location.INTERIOR] === jsts.geom.Dimension.FALSE &&
      this.matrix[jsts.geom.Location.BOUNDARY][jsts.geom.Location.BOUNDARY] === jsts.geom.Dimension.FALSE;
};


/**
 * Returns <code>true</code> if <code>isDisjoint</code> returns false.
 *
 * @return {boolean} <code>true</code> if the two <code>Geometry</code>s
 *         related by this <code>IntersectionMatrix</code> intersect.
 */
jsts.geom.IntersectionMatrix.prototype.isIntersects = function() {
  return !this.isDisjoint();
};


/**
 * Returns <code>true</code> if this <code>IntersectionMatrix</code> is
 * FT*******, F**T***** or F***T****.
 *
 * @param {int}
 *          dimensionOfGeometryA the dimension of the first
 *          <code>Geometry.</code>
 * @param {int}
 *          dimensionOfGeometryB the dimension of the second
 *          <code>Geometry.</code>
 * @return {boolean} <code>true</code> if the two <code>Geometry</code> s
 *         related by this <code>IntersectionMatrix</code> touch; Returns
 *         false if both <code>Geometry</code>s are points.
 */
jsts.geom.IntersectionMatrix.prototype.isTouches = function(
    dimensionOfGeometryA, dimensionOfGeometryB) {
  if (dimensionOfGeometryA > dimensionOfGeometryB) {
    // no need to get transpose because pattern matrix is symmetrical
    return this.isTouches(dimensionOfGeometryB, dimensionOfGeometryA);
  }
  if ((dimensionOfGeometryA == jsts.geom.Dimension.A && dimensionOfGeometryB == jsts.geom.Dimension.A) ||
      (dimensionOfGeometryA == jsts.geom.Dimension.L && dimensionOfGeometryB == jsts.geom.Dimension.L) ||
      (dimensionOfGeometryA == jsts.geom.Dimension.L && dimensionOfGeometryB == jsts.geom.Dimension.A) ||
      (dimensionOfGeometryA == jsts.geom.Dimension.P && dimensionOfGeometryB == jsts.geom.Dimension.A) ||
      (dimensionOfGeometryA == jsts.geom.Dimension.P && dimensionOfGeometryB == jsts.geom.Dimension.L)) {
    return this.matrix[jsts.geom.Location.INTERIOR][jsts.geom.Location.INTERIOR] === jsts.geom.Dimension.FALSE &&
        (jsts.geom.IntersectionMatrix
            .matches(
                this.matrix[jsts.geom.Location.INTERIOR][jsts.geom.Location.BOUNDARY],
                'T') ||
            jsts.geom.IntersectionMatrix
                .matches(
                    this.matrix[jsts.geom.Location.BOUNDARY][jsts.geom.Location.INTERIOR],
                    'T') || jsts.geom.IntersectionMatrix
            .matches(
                this.matrix[jsts.geom.Location.BOUNDARY][jsts.geom.Location.BOUNDARY],
                'T'));
  }
  return false;
};


/**
 * Tests whether this geometry crosses the specified geometry.
 * <p>
 * The <code>crosses</code> predicate has the following equivalent
 * definitions:
 * <ul>
 * <li>The geometries have some but not all interior points in common.
 * <li>The DE-9IM Intersection Matrix for the two geometries is
 * <ul>
 * <li>T*T****** (for P/L, P/A, and L/A situations)
 * <li>T*****T** (for L/P, L/A, and A/L situations)
 * <li>0******** (for L/L situations)
 * </ul>
 * </ul>
 * For any other combination of dimensions this predicate returns
 * <code>false</code>.
 * <p>
 * The SFS defined this predicate only for P/L, P/A, L/L, and L/A situations.
 * JTS extends the definition to apply to L/P, A/P and A/L situations as well.
 * This makes the relation symmetric.
 *
 * @param {int}
 *          dimensionOfGeometryA the dimension of the first
 *          <code>Geometry.</code>
 * @param {int}
 *          dimensionOfGeometryB the dimension of the second
 *          <code>Geometry.</code>
 * @return {boolean} <code>true</code> if the two <code>Geometry</code>s
 *         related by this <code>IntersectionMatrix</code> cross.
 */
jsts.geom.IntersectionMatrix.prototype.isCrosses = function(
    dimensionOfGeometryA, dimensionOfGeometryB) {
  if ((dimensionOfGeometryA == jsts.geom.Dimension.P && dimensionOfGeometryB == jsts.geom.Dimension.L) ||
      (dimensionOfGeometryA == jsts.geom.Dimension.P && dimensionOfGeometryB == jsts.geom.Dimension.A) ||
      (dimensionOfGeometryA == jsts.geom.Dimension.L && dimensionOfGeometryB == jsts.geom.Dimension.A)) {
    return jsts.geom.IntersectionMatrix.matches(
        this.matrix[jsts.geom.Location.INTERIOR][jsts.geom.Location.INTERIOR],
        'T') &&
        jsts.geom.IntersectionMatrix
            .matches(
                this.matrix[jsts.geom.Location.INTERIOR][jsts.geom.Location.EXTERIOR],
                'T');
  }
  if ((dimensionOfGeometryA == jsts.geom.Dimension.L && dimensionOfGeometryB == jsts.geom.Dimension.P) ||
      (dimensionOfGeometryA == jsts.geom.Dimension.A && dimensionOfGeometryB == jsts.geom.Dimension.P) ||
      (dimensionOfGeometryA == jsts.geom.Dimension.A && dimensionOfGeometryB == jsts.geom.Dimension.L)) {
    return jsts.geom.IntersectionMatrix.matches(
        matrix[jsts.geom.Location.INTERIOR][jsts.geom.Location.INTERIOR], 'T') &&
        jsts.geom.IntersectionMatrix
            .matches(
                this.matrix[jsts.geom.Location.EXTERIOR][jsts.geom.Location.INTERIOR],
                'T');
  }
  if (dimensionOfGeometryA === jsts.geom.Dimension.L &&
      dimensionOfGeometryB === jsts.geom.Dimension.L) {
    return this.matrix[jsts.geom.Location.INTERIOR][jsts.geom.Location.INTERIOR] === 0;
  }
  return false;
};


/**
 * Tests whether this <code>IntersectionMatrix</code> is T*F**F***.
 *
 * @return {boolean} <code>true</code> if the first <code>Geometry</code> is
 *         within the second.
 */
jsts.geom.IntersectionMatrix.prototype.isWithin = function() {
  return jsts.geom.IntersectionMatrix.matches(
      this.matrix[jsts.geom.Location.INTERIOR][jsts.geom.Location.INTERIOR],
      'T') &&
      this.matrix[jsts.geom.Location.INTERIOR][jsts.geom.Location.EXTERIOR] == jsts.geom.Dimension.FALSE &&
      this.matrix[jsts.geom.Location.BOUNDARY][jsts.geom.Location.EXTERIOR] == jsts.geom.Dimension.FALSE;
};


/**
 * Tests whether this <code>IntersectionMatrix</code> is T*****FF*.
 *
 * @return {boolean} <code>true</code> if the first <code>Geometry</code>
 *         contains the second.
 */
jsts.geom.IntersectionMatrix.prototype.isContains = function() {
  return jsts.geom.IntersectionMatrix.matches(
      this.matrix[jsts.geom.Location.INTERIOR][jsts.geom.Location.INTERIOR],
      'T') &&
      this.matrix[jsts.geom.Location.EXTERIOR][jsts.geom.Location.INTERIOR] == jsts.geom.Dimension.FALSE &&
      this.matrix[jsts.geom.Location.EXTERIOR][jsts.geom.Location.BOUNDARY] == jsts.geom.Dimension.FALSE;
};


/**
 * Returns <code>true</code> if this <code>IntersectionMatrix</code> is
 * <code>T*****FF*</code> or <code>*T****FF*</code> or
 * <code>***T**FF*</code> or <code>****T*FF*</code>
 *
 * @return {boolean} <code>true</code> if the first <code>Geometry</code>
 *         covers the second.
 */
jsts.geom.IntersectionMatrix.prototype.isCovers = function() {
  var hasPointInCommon = jsts.geom.IntersectionMatrix.matches(
      this.matrix[jsts.geom.Location.INTERIOR][jsts.geom.Location.INTERIOR],
      'T') ||
      jsts.geom.IntersectionMatrix
          .matches(
              this.matrix[jsts.geom.Location.INTERIOR][jsts.geom.Location.BOUNDARY],
              'T') ||
      jsts.geom.IntersectionMatrix
          .matches(
              this.matrix[jsts.geom.Location.BOUNDARY][jsts.geom.Location.INTERIOR],
              'T') ||
      jsts.geom.IntersectionMatrix
          .matches(
              this.matrix[jsts.geom.Location.BOUNDARY][jsts.geom.Location.BOUNDARY],
              'T');

  return hasPointInCommon &&
      this.matrix[jsts.geom.Location.EXTERIOR][jsts.geom.Location.INTERIOR] == jsts.geom.Dimension.FALSE &&
      this.matrix[jsts.geom.Location.EXTERIOR][jsts.geom.Location.BOUNDARY] == jsts.geom.Dimension.FALSE;
};


/**
 * Returns <code>true</code> if this <code>IntersectionMatrix</code> is
 * <code>T*F**F***</code> or <code>*TF**F***</code> or
 * <code>**FT*F***</code> or <code>**F*TF***</code>
 *
 * @return {boolean} <code>true</code> if the first <code>Geometry</code> is
 *         covered by the second.
 */
jsts.geom.IntersectionMatrix.prototype.isCoveredBy = function() {
  var hasPointInCommon = jsts.geom.IntersectionMatrix.matches(
      this.matrix[jsts.geom.Location.INTERIOR][jsts.geom.Location.INTERIOR],
      'T') ||
      jsts.geom.IntersectionMatrix
          .matches(
              this.matrix[jsts.geom.Location.INTERIOR][jsts.geom.Location.BOUNDARY],
              'T') ||
      jsts.geom.IntersectionMatrix
          .matches(
              this.matrix[jsts.geom.Location.BOUNDARY][jsts.geom.Location.INTERIOR],
              'T') ||
      jsts.geom.IntersectionMatrix
          .matches(
              this.matrix[jsts.geom.Location.BOUNDARY][jsts.geom.Location.BOUNDARY],
              'T');

  return hasPointInCommon &&
      this.matrix[jsts.geom.Location.INTERIOR][jsts.geom.Location.EXTERIOR] === jsts.geom.Dimension.FALSE &&
      this.matrix[jsts.geom.Location.BOUNDARY][jsts.geom.Location.EXTERIOR] === jsts.geom.Dimension.FALSE;
};


/**
 * Returns <code>true</code> if this <code>IntersectionMatrix</code> is
 * T*F**FFF*.
 *
 * @param {int}
 *          dimensionOfGeometryA the dimension of the first
 *          <code>Geometry.</code>
 * @param {int}
 *          dimensionOfGeometryB the dimension of the second
 *          <code>Geometry.</code>
 * @return {boolean} <code>true</code> if the two <code>Geometry</code> s
 *         related by this <code>IntersectionMatrix</code> are equal; the
 *         <code>Geometry</code>s must have the same dimension for this
 *         function to return <code>true.</code>
 */
jsts.geom.IntersectionMatrix.prototype.isEquals = function(
    dimensionOfGeometryA, dimensionOfGeometryB) {
  if (dimensionOfGeometryA !== dimensionOfGeometryB) {
    return false;
  }
  return jsts.geom.IntersectionMatrix.matches(
      this.matrix[jsts.geom.Location.INTERIOR][jsts.geom.Location.INTERIOR],
      'T') &&
      this.matrix[jsts.geom.Location.EXTERIOR][jsts.geom.Location.INTERIOR] === jsts.geom.Dimension.FALSE &&
      this.matrix[jsts.geom.Location.INTERIOR][jsts.geom.Location.EXTERIOR] === jsts.geom.Dimension.FALSE &&
      this.matrix[jsts.geom.Location.EXTERIOR][jsts.geom.Location.BOUNDARY] === jsts.geom.Dimension.FALSE &&
      this.matrix[jsts.geom.Location.BOUNDARY][jsts.geom.Location.EXTERIOR] === jsts.geom.Dimension.FALSE;
};


/**
 * Returns <code>true</code> if this <code>IntersectionMatrix</code> is
 * <UL>
 * <LI> T*T***T** (for two points or two surfaces)
 * <LI> 1*T***T** (for two curves)
 * </UL>.
 *
 * @param {int}
 *          dimensionOfGeometryA the dimension of the first
 *          <code>Geometry.</code>
 * @param {int}
 *          dimensionOfGeometryB the dimension of the second
 *          <code>Geometry.</code>
 * @return {boolean} <code>true</code> if the two <code>Geometry</code>s
 *         related by this <code>IntersectionMatrix</code> overlap. For this
 *         function to return <code>true</code>, the <code>Geometry</code>s
 *         must be two points, two curves or two surfaces.
 */
jsts.geom.IntersectionMatrix.prototype.isOverlaps = function(
    dimensionOfGeometryA, dimensionOfGeometryB) {
  if ((dimensionOfGeometryA == jsts.geom.Dimension.P && dimensionOfGeometryB === jsts.geom.Dimension.P) ||
      (dimensionOfGeometryA == jsts.geom.Dimension.A && dimensionOfGeometryB === jsts.geom.Dimension.A)) {
    return jsts.geom.IntersectionMatrix.matches(
        this.matrix[jsts.geom.Location.INTERIOR][jsts.geom.Location.INTERIOR],
        'T') &&
        jsts.geom.IntersectionMatrix
            .matches(
                this.matrix[jsts.geom.Location.INTERIOR][jsts.geom.Location.EXTERIOR],
                'T') &&
        jsts.geom.IntersectionMatrix
            .matches(
                this.matrix[jsts.geom.Location.EXTERIOR][jsts.geom.Location.INTERIOR],
                'T');
  }
  if (dimensionOfGeometryA === jsts.geom.Dimension.L &&
      dimensionOfGeometryB === jsts.geom.Dimension.L) {
    return this.matrix[jsts.geom.Location.INTERIOR][jsts.geom.Location.INTERIOR] == 1 &&
        jsts.geom.IntersectionMatrix
            .matches(
                this.matrix[jsts.geom.Location.INTERIOR][jsts.geom.Location.EXTERIOR],
                'T') &&
        jsts.geom.IntersectionMatrix
            .matches(
                this.matrix[jsts.geom.Location.EXTERIOR][jsts.geom.Location.INTERIOR],
                'T');
  }
  return false;
};


/**
 * Returns whether the elements of this <code>IntersectionMatrix</code>
 * satisfies the required dimension symbols.
 *
 * @param {string}
 *          requiredDimensionSymbols nine dimension symbols with which to
 *          compare the elements of this <code>IntersectionMatrix</code>.
 *          Possible values are <code>{T, F, * , 0, 1, 2}</code>.
 * @return {boolean} <code>true</code> if this <code>IntersectionMatrix</code>
 *         matches the required dimension symbols.
 */
jsts.geom.IntersectionMatrix.prototype.matches = function(
    requiredDimensionSymbols) {
  if (requiredDimensionSymbols.length != 9) {
    throw new jsts.error.IllegalArgumentException('Should be length 9: ' +
        requiredDimensionSymbols);
  }
  for (var ai = 0; ai < 3; ai++) {
    for (var bi = 0; bi < 3; bi++) {
      if (!jsts.geom.IntersectionMatrix.matches(this.matrix[ai][bi],
          requiredDimensionSymbols.charAt(3 * ai + bi))) {
        return false;
      }
    }
  }
  return true;
};


/**
 * Transposes this IntersectionMatrix.
 *
 * @return {IntersectionMatrix} this <code>IntersectionMatrix</code> as a
 *         convenience.
 */
jsts.geom.IntersectionMatrix.prototype.transpose = function() {
  var temp = matrix[1][0];
  this.matrix[1][0] = this.matrix[0][1];
  this.matrix[0][1] = temp;
  temp = this.matrix[2][0];
  this.matrix[2][0] = this.matrix[0][2];
  this.matrix[0][2] = temp;
  temp = this.matrix[2][1];
  this.matrix[2][1] = this.matrix[1][2];
  this.matrix[1][2] = temp;
  return this;
};


/**
 * Returns a nine-character <code>String</code> representation of this
 * <code>IntersectionMatrix</code> .
 *
 * @return {string} the nine dimension symbols of this
 *         <code>IntersectionMatrix</code> in row-major order.
 */
jsts.geom.IntersectionMatrix.prototype.toString = function() {
  var ai, bi, buf = '';
  for (ai = 0; ai < 3; ai++) {
    for (bi = 0; bi < 3; bi++) {
      buf += jsts.geom.Dimension.toDimensionSymbol(this.matrix[ai][bi]);
    }
  }
  return buf;
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * A lightweight class used to store coordinates on the 2-dimensional Cartesian
 * plane. It is distinct from {@link Point}, which is a subclass of
 * {@link Geometry}. Unlike objects of type {@link Point} (which contain
 * additional information such as an envelope, a precision model, and spatial
 * reference system information), a <code>Coordinate</code> only contains
 * coordinate values and accessor methods.
 *
 * @requires jsts/geom/Geometry.js
 */



/**
 * @constructor
 * @augments OpenLayers.Geometry.Point
 * @augments jsts.geom.Geometry
 */
jsts.geom.Coordinate = function() {
};
jsts.geom.Coordinate = OpenLayers.Class();


/**
 * Sets this <code>Coordinate</code>s (x,y,z) values to that of
 * <code>other</code>.
 *
 * @param {Coordinate}
 *          other the <code>Coordinate</code> to copy.
 */
jsts.geom.Coordinate.prototype.setCoordinate = function(other) {
  this.x = other.x;
  this.y = other.y;
};


/**
 * Clones this instance.
 *
 * @return {jsts.geom.Coordinate} A point instance cloned from this.
 */
jsts.geom.Coordinate.prototype.clone = function() {
  return new jsts.geom.Coordinate(this.x, this.y);
};


/**
 * Computes the 2-dimensional Euclidean distance to another location. The
 * Z-ordinate is ignored.
 *
 * @param {Coordinate}
 *          p a point.
 * @return {double} the 2-dimensional Euclidean distance between the locations.
 */
jsts.geom.Coordinate.prototype.distance = function(p) {
  var dx = this.x - p.x;
  var dy = this.y - p.y;

  return Math.sqrt(dx * dx + dy * dy);
};


/**
 * Returns whether the planar projections of the two <code>Coordinate</code>s
 * are equal.
 *
 * @param {Coordinate}
 *          other a <code>Coordinate</code> with which to do the 2D
 *          comparison.
 * @return {boolean} <code>true</code> if the x- and y-coordinates are equal;
 *         the z-coordinates do not have to be equal.
 */
jsts.geom.Coordinate.prototype.equals2D = function(other) {
  if (this.x !== other.x) {
    return false;
  }

  if (this.y !== other.y) {
    return false;
  }

  return true;
};


/**
 * Returns <code>true</code> if <code>other</code> has the same values for
 * the x and y ordinates. Since Coordinates are 2.5D, this routine ignores the z
 * value when making the comparison.
 *
 * @param {Coordinate}
 *          other a <code>Coordinate</code> with which to do the comparison.
 * @return {boolean} <code>true</code> if <code>other</code> is a
 *         <code>Coordinate</code> with the same values for the x and y
 *         ordinates.
 */
jsts.geom.Coordinate.prototype.equals = function(other) {
  if (!other instanceof jsts.geom.Coordinate || other === undefined) {
    return false;
  }
  return this.equals2D(other);
};


/**
 * Compares this {@link Coordinate} with the specified {@link Coordinate} for
 * order. This method ignores the z value when making the comparison. Returns:
 * <UL>
 * <LI> -1 : this.x < other.x || ((this.x == other.x) && (this.y < other.y))
 * <LI> 0 : this.x == other.x && this.y = other.y
 * <LI> 1 : this.x > other.x || ((this.x == other.x) && (this.y > other.y))
 *
 * </UL>
 * Note: This method assumes that ordinate values are valid numbers. NaN values
 * are not handled correctly.
 *
 * @param {Coordinate}
 *          other the <code>Coordinate</code> with which this
 *          <code>Coordinate</code> is being compared.
 * @return {Boolean} -1, zero, or 1 as explained above.
 */
jsts.geom.Coordinate.prototype.compareTo = function(other) {
  if (this.x < other.x) {
    return -1;
  }
  if (this.x > other.x) {
    return 1;
  }
  if (this.y < other.y) {
    return -1;
  }
  if (this.y > other.y) {
    return 1;
  }

  return 0;
};


/**
 * @return {Coordinate[]} this Point as coordinate array.
 */
jsts.geom.Coordinate.prototype.getCoordinates = function() {
  return this.isEmpty() ? [] : [this.coordinate];
};


/**
 * @return {int} number of coordinates (0 or 1).
 */
jsts.geom.Coordinate.prototype.getNumPoints = function() {
  return this.isEmpty() ? 0 : 1;
};


/**
 * @return {Boolean} true ifPoint is empty.
 */
jsts.geom.Coordinate.prototype.isEmpty = function() {
  return this.x === null;
};


/**
 * @return {Boolean} Point is always simple.
 */
jsts.geom.Coordinate.prototype.isSimple = function() {
  return true;
};


/**
 * A Point is valid iff:
 * <ul>
 * <li>the coordinate which defines it is a valid coordinate (i.e does not have
 * an NaN X or Y ordinate)
 * </ul>
 *
 * @return {boolean} true iff the Point is valid.
 */
jsts.geom.Coordinate.prototype.isValid = function() {
  if (!IsValidOp.isValid(getCoordinate())) {
    return false;
  }
  return true;
};


/**
 * @return {double} x-axis value of this Coordinate.
 */
jsts.geom.Coordinate.prototype.getX = function() {
  return this.x;
};


/**
 * @return {double} y-axis value of this Coordinate.
 */
jsts.geom.Coordinate.prototype.getY = function() {
  return this.y;
};


/**
 * @return {Coordinate} this Point coordinate.
 */
jsts.geom.Coordinate.prototype.getCoordinate = function() {
  return this;
};


/**
 * @return {String} String representation of Point type.
 */
jsts.geom.Coordinate.prototype.getGeometryType = function() {
  return 'Coordinate';
};


/**
 * @param {Point}
 *          other point to compare.
 * @param {double}
 *          tolerance tolerance used in comparison.
 * @return {Boolean} true if gemetries match.
 */
jsts.geom.Coordinate.prototype.equalsExact = function(other, tolerance) {
  if (this.CLASS_NAME !== other.CLASS_NAME) {
    return false;
  }
  if (this.isEmpty() && other.isEmpty()) {
    return true;
  }
  return jsts.geom.Geometry.prototype.equal(other, this, tolerance);
};


/**
 * @return {Point} Reversed point is a cloned point.
 */
jsts.geom.Coordinate.prototype.reverse = function() {
  return this.clone();
};


/**
 *
 */
jsts.geom.Coordinate.prototype.normalize = function() {
  // a Point is always in normalized form
};

jsts.geom.Coordinate.prototype.hashCode = function() {
  return '' + this.x + this.y;
};


OpenLayers.Geometry.Point = OpenLayers.Class(OpenLayers.Geometry.Point,
    jsts.geom.Coordinate, {
      // replace constructor with one that also accepts JTS arguments
      initialize: function(x, y) {
        OpenLayers.Geometry.prototype.initialize.apply(this, arguments);
        if (x === undefined || x === null) {
        } else if (typeof x === 'number' || typeof x === 'string') {
          this.x = parseFloat(x);
          this.y = parseFloat(y);
        } else if (x instanceof jsts.geom.Coordinate) {
          y = x.y;
          x = x.x;
          this.x = parseFloat(x);
          this.y = parseFloat(y);
        }
      }
    });
jsts.geom.Coordinate = OpenLayers.Geometry.Point;

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Defines a rectangular region of the 2D coordinate plane. It is often used to
 * represent the bounding box of a {@link Geometry}, e.g. the minimum and
 * maximum x and y values of the {@link Coordinate}s.
 * <p>
 * Note that Envelopes support infinite or half-infinite regions, by using the
 * values of <code>Double.POSITIVE_INFINITY</code> and
 * <code>Double.NEGATIVE_INFINITY</code>.
 * <p>
 * When Envelope objects are created or initialized, the supplies extent values
 * are automatically sorted into the correct order.
 */



/**
 * Creates an <code>Envelope</code> for a region defined by maximum and
 * minimum values.
 *
 * @constructor
 */
jsts.geom.Envelope = function() {
  jsts.geom.Envelope.prototype.init.apply(this, arguments);
};


/**
 * the minimum x-coordinate
 *
 * @type {double}
 */
jsts.geom.Envelope.prototype.minx = null;


/**
 * the maximum x-coordinate
 *
 * @type {double}
 */
jsts.geom.Envelope.prototype.maxx = null;


/**
 * the minimum y-coordinate
 *
 * @type {double}
 */
jsts.geom.Envelope.prototype.miny = null;


/**
 * the maximum y-coordinate
 *
 * @type {double}
 */
jsts.geom.Envelope.prototype.maxy = null;


/**
 * Creates an <code>Envelope</code> for a region defined by maximum and
 * minimum values.
 *
 * Will call appropriate init* method depending on arguments.
 */
jsts.geom.Envelope.prototype.init = function() {
  if (typeof arguments[0] === 'number' && arguments.length === 4) {
    this.initFromValues(arguments[0], arguments[1], arguments[2], arguments[3]);
  } else if (arguments[0] instanceof jsts.geom.Coordinate &&
      arguments.length === 1) {
    this.initFromCoordinate(arguments[0]);
  } else if (arguments[0] instanceof jsts.geom.Coordinate &&
      arguments.length === 2) {
    this.initFromCoordinates(arguments[0], arguments[1]);
  } else if (arguments[0] instanceof jsts.geom.Envelope &&
      arguments.length === 1) {
    this.initFromEnvelope(arguments[0]);
  }
};


/**
 * Initialize an <code>Envelope</code> for a region defined by maximum and
 * minimum values.
 *
 * @param {double}
 *          x1 the first x-value.
 * @param {double}
 *          x2 the second x-value.
 * @param {double}
 *          y1 the first y-value.
 * @param {double}
 *          y2 the second y-value.
 */
jsts.geom.Envelope.prototype.initFromValues = function(x1, x2, y1, y2) {
  if (x1 < x2) {
    this.minx = x1;
    this.maxx = x2;
  } else {
    this.minx = x2;
    this.maxx = x1;
  }
  if (y1 < y2) {
    this.miny = y1;
    this.maxy = y2;
  } else {
    this.miny = y2;
    this.maxy = y1;
  }
};


/**
 * Initialize an <code>Envelope</code> to a region defined by two Coordinates.
 *
 * @param {jsts.geom.Coordinate}
 *          p1 the first Coordinate.
 * @param {jsts.geom.Coordinate}
 *          p2 the second Coordinate.
 */
jsts.geom.Envelope.prototype.initFromCoordinates = function(p1, p2) {
  this.initFromValues(p1.x, p2.x, p1.y, p2.y);
};


/**
 * Initialize an <code>Envelope</code> to a region defined by a single
 * Coordinate.
 *
 * @param {jsts.geom.Coordinate}
 *          p the Coordinate.
 */
jsts.geom.Envelope.prototype.initFromCoordinate = function(p) {
  this.initFromCoordinates(p.x, p.x, p.y, p.y);
};


/**
 * Initialize an <code>Envelope</code> from an existing Envelope.
 *
 * @param {jsts.geom.Envelope}
 *          env the Envelope to initialize from.
 */
jsts.geom.Envelope.prototype.initFromEnvelope = function(env) {
  this.minx = env.minx;
  this.maxx = env.maxx;
  this.miny = env.miny;
  this.maxy = env.maxy;
};


/**
 * Makes this <code>Envelope</code> a "null" envelope, that is, the envelope
 * of the empty geometry.
 */
jsts.geom.Envelope.prototype.setToNull = function() {
  this.minx = 0;
  this.maxx = -1;
  this.miny = 0;
  this.maxy = -1;
};


/**
 * Returns <code>true</code> if this <code>Envelope</code> is a "null"
 * envelope.
 *
 * @return {boolean} <code>true</code> if this <code>Envelope</code> is
 *         uninitialized or is the envelope of the empty geometry.
 */
jsts.geom.Envelope.prototype.isNull = function() {
  return this.maxx < this.minx;
};


/**
 * Returns the difference between the maximum and minimum y values.
 *
 * @return {double} max y - min y, or 0 if this is a null <code>Envelope.</code>
 */
jsts.geom.Envelope.prototype.getHeight = function() {
  if (this.isNull()) {
    return 0;
  }
  return this.maxy - this.miny;
};


/**
 * Returns the difference between the maximum and minimum x values.
 *
 * @return {double} max x - min x, or 0 if this is a null <code>Envelope.</code>
 */
jsts.geom.Envelope.prototype.getWidth = function() {
  if (this.isNull()) {
    return 0;
  }
  return this.maxx - this.minx;
};


/**
 * Returns the <code>Envelope</code>s minimum x-value. min x > max x
 * indicates that this is a null <code>Envelope</code>.
 *
 * @return {double} the minimum x-coordinate.
 */
jsts.geom.Envelope.prototype.getMinX = function() {
  return this.minx;
};


/**
 * Returns the <code>Envelope</code>s maximum x-value. min x > max x
 * indicates that this is a null <code>Envelope</code>.
 *
 * @return {double} the maximum x-coordinate.
 */
jsts.geom.Envelope.prototype.getMaxX = function() {
  return this.maxx;
};


/**
 * Returns the <code>Envelope</code>s minimum y-value. min y > max y
 * indicates that this is a null <code>Envelope</code>.
 *
 * @return {double} the minimum y-coordinate.
 */
jsts.geom.Envelope.prototype.getMinY = function() {
  return this.miny;
};


/**
 * Returns the <code>Envelope</code>s maximum y-value. min y > max y
 * indicates that this is a null <code>Envelope</code>.
 *
 * @return {double} the maximum y-coordinate.
 */
jsts.geom.Envelope.prototype.getMaxY = function() {
  return this.maxy;
};


/**
 * Gets the area of this envelope.
 *
 * @return {double} the area of the envelope, 0.0 if the envelope is null.
 */
jsts.geom.Envelope.prototype.getArea = function() {
  return getWidth() * getHeight();
};


/**
 * Enlarges this <code>Envelope</code>
 *
 * Will call appropriate expandToInclude* depending on arguments.
 */
jsts.geom.Envelope.prototype.expandToInclude = function() {
  if (arguments[0] instanceof jsts.geom.Coordinate) {
    this.expandToIncludeCoordinate(arguments[0]);
  } else if (arguments[0] instanceof jsts.geom.Envelope) {
    this.expandToIncludeEnvelope(arguments[0]);
  } else {
    this.expandToIncludeValues(arguments[0], arguments[1]);
  }
};


/**
 * Enlarges this <code>Envelope</code> so that it contains the given
 * {@link Coordinate}. Has no effect if the point is already on or within the
 * envelope.
 *
 * @param {Coordinate}
 *          p the Coordinate to expand to include.
 */
jsts.geom.Envelope.prototype.expandToIncludeCoordinate = function(p) {
  this.expandToIncludeValues(p.x, p.y);
};


/**
 * Enlarges this <code>Envelope</code> so that it contains the given point.
 * Has no effect if the point is already on or within the envelope.
 *
 * @param {double}
 *          x the value to lower the minimum x to or to raise the maximum x to.
 * @param {double}
 *          y the value to lower the minimum y to or to raise the maximum y to.
 */
jsts.geom.Envelope.prototype.expandToIncludeValues = function(x, y) {
  if (this.isNull()) {
    this.minx = x;
    this.maxx = x;
    this.miny = y;
    this.maxy = y;
  } else {
    if (x < this.minx) {
      this.minx = x;
    }
    if (x > this.maxx) {
      this.maxx = x;
    }
    if (y < this.miny) {
      this.miny = y;
    }
    if (y > this.maxy) {
      this.maxy = y;
    }
  }
};


/**
 * Enlarges this <code>Envelope</code> so that it contains the
 * <code>other</code> Envelope. Has no effect if <code>other</code> is
 * wholly on or within the envelope.
 *
 * @param {Envelope}
 *          other the <code>Envelope</code> to expand to include.
 */
jsts.geom.Envelope.prototype.expandToIncludeEnvelope = function(other) {
  if (other.isNull()) {
    return;
  }
  if (this.isNull()) {
    this.minx = other.getMinX();
    this.maxx = other.getMaxX();
    this.miny = other.getMinY();
    this.maxy = other.getMaxY();
  } else {
    if (other.minx < this.minx) {
      this.minx = other.minx;
    }
    if (other.maxx > this.maxx) {
      this.maxx = other.maxx;
    }
    if (other.miny < this.miny) {
      this.miny = other.miny;
    }
    if (other.maxy > this.maxy) {
      this.maxy = other.maxy;
    }
  }
};


/**
 * Enlarges this <code>Envelope</code>
 *
 * Will call appropriate expandBy* depending on arguments.
 */
jsts.geom.Envelope.prototype.expandBy = function() {
  if (arguments.length === 1) {
    this.expandByDistance(arguments[0]);
  } else {
    this.expandByDistances(arguments[0], arguments[1]);
  }
};


/**
 * Expands this envelope by a given distance in all directions. Both positive
 * and negative distances are supported.
 *
 * @param {double}
 *          distance the distance to expand the envelope.
 */
jsts.geom.Envelope.prototype.expandByDistance = function(distance) {
  this.expandByDistances(distance, distance);
};


/**
 * Expands this envelope by a given distance in all directions. Both positive
 * and negative distances are supported.
 *
 * @param {double}
 *          deltaX the distance to expand the envelope along the the X axis.
 * @param {double}
 *          deltaY the distance to expand the envelope along the the Y axis.
 */
jsts.geom.Envelope.prototype.expandByDistances = function(deltaX, deltaY) {
  if (this.isNull()) {
    return;
  }

  this.minx -= deltaX;
  this.maxx += deltaX;
  this.miny -= deltaY;
  this.maxy += deltaY;

  // check for envelope disappearing
  if (this.minx > this.maxx || this.miny > this.maxy) {
    this.setToNull();
  }
};


/**
 * Translates this envelope by given amounts in the X and Y direction.
 *
 * @param {double}
 *          transX the amount to translate along the X axis.
 * @param {double}
 *          transY the amount to translate along the Y axis.
 */
jsts.geom.Envelope.prototype.translate = function(transX, transY) {
  if (this.isNull()) {
    return;
  }
  this.init(this.minx + transX, this.maxx + transX, this.miny + transY,
      this.maxy + transY);
};


/**
 * Computes the coordinate of the centre of this envelope (as long as it is
 * non-null
 *
 * @return {Coordinate} the centre coordinate of this envelope <code>null</code>
 *         if the envelope is null.
 */
jsts.geom.Envelope.prototype.centre = function() {
  if (this.isNull()) {
    return null;
  }
  return new jsts.geom.Coordinate((this.minx + this.maxx) / 2.0,
      (this.miny + this.maxy) / 2.0);
};


/**
 * Computes the intersection of two {@link Envelopes}
 *
 * @param {Envelope}
 *          env the envelope to intersect with.
 * @return {jsts.geom.Envelope} a new Envelope representing the intersection of
 *         the envelopes (this will be the null envelope if either argument is
 *         null, or they do not intersect.
 */
jsts.geom.Envelope.prototype.intersection = function(env) {
  if (this.isNull() || env.isNull() || !this.intersects(env)) {
    return new jsts.geom.Envelope();
  }

  var intMinX = this.minx > env.minx ? this.minx : env.minx;
  var intMinY = this.miny > env.miny ? this.miny : env.miny;
  var intMaxX = this.maxx < env.maxx ? this.maxx : env.maxx;
  var intMaxY = this.maxy < env.maxy ? this.maxy : env.maxy;

  return new jsts.geom.Envelope(intMinX, intMaxX, intMinY, intMaxY);
};


/**
 * Check if the region defined by input overlaps (intersects) the region of this
 * <code>Envelope</code>.
 *
 * Will call appropriate intersects* depending on arguments.
 *
 * @return {boolean} <code>true</code> if an overlap is found.
 */
jsts.geom.Envelope.prototype.intersects = function() {
  if (arguments[0] instanceof jsts.geom.Envelope) {
    return this.intersectsEnvelope(arguments[0]);
  } else if (arguments[0] instanceof jsts.geom.Coordinate) {
    return this.intersectsCoordinate(arguments[0]);
  } else {
    return this.intersectsValues(arguments[0], arguments[1]);
  }
};


/**
 * Check if the region defined by <code>other</code> overlaps (intersects) the
 * region of this <code>Envelope</code>.
 *
 * @param {Envelope}
 *          other the <code>Envelope</code> which this <code>Envelope</code>
 *          is being checked for overlapping.
 * @return {boolean} <code>true</code> if the <code>Envelope</code>s
 *         overlap.
 */
jsts.geom.Envelope.prototype.intersectsEnvelope = function(other) {
  if (this.isNull() || other.isNull()) {
    return false;
  }

  var result = !(other.minx > this.maxx || other.maxx < this.minx ||
      other.miny > this.maxy || other.maxy < this.miny);
  return result;
};


/**
 * Check if the point <code>p</code> overlaps (lies inside) the region of this
 * <code>Envelope</code>.
 *
 * @param {Coordinate}
 *          p the <code>Coordinate</code> to be tested.
 * @return {boolean} <code>true</code> if the point overlaps this
 *         <code>Envelope.</code>
 */
jsts.geom.Envelope.prototype.intersectsCoordinate = function(p) {
  return this.intersectsValues(p.x, p.y);
};


/**
 * Check if the point <code>(x, y)</code> overlaps (lies inside) the region of
 * this <code>Envelope</code>.
 *
 * @param {double}
 *          x the x-ordinate of the point.
 * @param {double}
 *          y the y-ordinate of the point.
 * @return {boolean} <code>true</code> if the point overlaps this
 *         <code>Envelope.</code>
 */
jsts.geom.Envelope.prototype.intersectsValues = function(x, y) {
  if (this.isNull()) {
    return false;
  }

  return !(x > this.maxx || x < this.minx || y > this.maxy || y < this.miny);
};


/**
 * Tests if the input lies wholely inside this <code>Envelope</code>
 * (inclusive of the boundary).
 *
 * Will call appropriate contains* depending on arguments.
 *
 * @return {boolean} true if input is contained in this <code>Envelope.</code>
 */
jsts.geom.Envelope.prototype.contains = function() {
  if (arguments[0] instanceof jsts.geom.Envelope) {
    return this.containsEnvelope(arguments[0]);
  } else if (arguments[0] instanceof jsts.geom.Coordinate) {
    return this.containsCoordinate(arguments[0]);
  } else {
    return this.containsValues(arguments[0], arguments[1]);
  }
};


/**
 * Tests if the <code>Envelope other</code> lies wholely inside this
 * <code>Envelope</code> (inclusive of the boundary).
 * <p>
 * Note that this is <b>not</b> the same definition as the SFS
 * <tt>contains</tt>, which would exclude the envelope boundary.
 *
 * @param {Envelope}
 *          other the <code>Envelope</code> to check.
 * @return {boolean} true if <code>other</code> is contained in this
 *         <code>Envelope.</code>
 *
 * @see covers(Envelope)
 */
jsts.geom.Envelope.prototype.containsEnvelope = function(other) {
  return this.coversEnvelope(other);
};


/**
 * Tests if the given point lies in or on the envelope.
 * <p>
 * Note that this is <b>not</b> the same definition as the SFS
 * <tt>contains</tt>, which would exclude the envelope boundary.
 *
 * @param {Coordinate}
 *          p the point which this <code>Envelope</code> is being checked for
 *          containing.
 * @return {boolean} <code>true</code> if the point lies in the interior or on
 *         the boundary of this <code>Envelope</code>.
 *
 * @see covers(Coordinate)
 */
jsts.geom.Envelope.prototype.containsCoordinate = function(p) {
  return this.coversCoordinate(p);
};


/**
 * Tests if the given point lies in or on the envelope.
 * <p>
 * Note that this is <b>not</b> the same definition as the SFS
 * <tt>contains</tt>, which would exclude the envelope boundary.
 *
 * @param {double}
 *          x the x-coordinate of the point which this <code>Envelope</code>
 *          is being checked for containing.
 * @param {double}
 *          y the y-coordinate of the point which this <code>Envelope</code>
 *          is being checked for containing.
 * @return {boolean} <code>true</code> if <code>(x, y)</code> lies in the
 *         interior or on the boundary of this <code>Envelope</code>.
 *
 * @see covers(double, double)
 */
jsts.geom.Envelope.prototype.containsValues = function(x, y) {
  return this.coversValues(x, y);
};


/**
 * Tests if the given point lies in or on the envelope.
 *
 * Will call appropriate contains* depending on arguments.
 */
jsts.geom.Envelope.prototype.covers = function() {
  if (p instanceof jsts.geom.Envelope) {
    this.coversEnvelope(arguments[0]);
  } else if (p instanceof jsts.geom.Coordinate) {
    this.coversCoordinate(arguments[0]);
  } else {
    this.coversValues(arguments[0], arguments[1]);
  }
};


/**
 * Tests if the given point lies in or on the envelope.
 *
 * @param {double}
 *          x the x-coordinate of the point which this <code>Envelope</code>
 *          is being checked for containing.
 * @param {double}
 *          y the y-coordinate of the point which this <code>Envelope</code>
 *          is being checked for containing.
 * @return {boolean} <code>true</code> if <code>(x, y)</code> lies in the
 *         interior or on the boundary of this <code>Envelope</code>.
 */
jsts.geom.Envelope.prototype.coversValues = function(x, y) {
  if (this.isNull()) {
    return false;
  }
  return x >= this.minx && x <= this.maxx && y >= this.miny && y <= this.maxy;
};


/**
 * Tests if the given point lies in or on the envelope.
 *
 * @param {Coordinate}
 *          p the point which this <code>Envelope</code> is being checked for
 *          containing.
 * @return {boolean} <code>true</code> if the point lies in the interior or on
 *         the boundary of this <code>Envelope</code>.
 */
jsts.geom.Envelope.prototype.coversCoordinate = function(p) {
  return this.coversValues(p.x, p.y);
};


/**
 * Tests if the <code>Envelope other</code> lies wholely inside this
 * <code>Envelope</code> (inclusive of the boundary).
 *
 * @param {Envelope}
 *          other the <code>Envelope</code> to check.
 * @return {boolean} true if this <code>Envelope</code> covers the
 *         <code>other.</code>
 */
jsts.geom.Envelope.prototype.coversEnvelope = function(other) {
  if (this.isNull() || other.isNull()) {
    return false;
  }
  return other.minx >= this.minx && other.maxx <= this.maxx &&
      other.miny >= this.miny && other.maxy <= this.maxy;
};


/**
 * Computes the distance between this and another <code>Envelope</code>.
 *
 * @param {Envelope}
 *          env The <code>Envelope</code> to test this <code>Envelope</code>
 *          against.
 * @return {double} The distance between overlapping Envelopes is 0. Otherwise,
 *         the distance is the Euclidean distance between the closest points.
 */
jsts.geom.Envelope.prototype.distance = function(env) {
  if (this.intersects(env)) {
    return 0;
  }
  var dx = 0.0;
  if (this.maxx < env.minx) {
    dx = env.minx - this.maxx;
  }
  if (this.minx > env.maxx) {
    dx = this.minx - env.maxx;
  }

  var dy = 0.0;
  if (this.maxy < env.miny) {
    dy = env.miny - this.maxy;
  }
  if (this.miny > env.maxy) {
    dy = this.miny - env.maxy;
  }

  // if either is zero, the envelopes overlap either vertically or horizontally
  if (dx === 0.0) {
    return dy;
  }
  if (dy === 0.0) {
    return dx;
  }
  return Math.sqrt(dx * dx + dy * dy);
};


/**
 * @param {Envelope}
 *          other the <code>Envelope</code> to check against.
 * @return {boolean} true if envelopes are equal.
 */
jsts.geom.Envelope.prototype.equals = function(other) {
  if (this.isNull()) {
    return other.isNull();
  }
  return this.maxx === other.maxx && this.maxy === other.maxy &&
      this.minx === other.minx && this.miny === other.miny;
};


/**
 * @return {String} String representation of this <code>Envelope.</code>
 */
jsts.geom.Envelope.prototype.toString = function() {
  return 'Env[' + this.minx + ' : ' + this.maxx + ', ' + this.miny + ' : ' +
      this.maxy + ']';
};


/**
 * Test the point q to see whether it intersects the Envelope defined by p1-p2
 *
 * NOTE: calls intersectsEnvelope if four arguments are given to simulate overloaded function
 *
 * @param {jsts.geom.Coordinate}
 *          p1 one extremal point of the envelope.
 * @param {jsts.geom.Coordinate}
 *          p2 another extremal point of the envelope.
 * @param {jsts.geom.Coordinate}
 *          q the point to test for intersection.
 * @return {boolean} <code>true</code> if q intersects the envelope p1-p2.
 */
jsts.geom.Envelope.intersects = function(p1, p2, q) {
  if (arguments.length === 4) {
    return jsts.geom.Envelope.intersectsEnvelope(arguments[0], arguments[1], arguments[2], arguments[3]);
  }

  var xc1 = p1.x < p2.x ? p1.x : p2.x;
  var xc2 = p1.x > p2.x ? p1.x : p2.x;
  var yc1 = p1.y < p2.y ? p1.y : p2.y;
  var yc2 = p1.y > p2.y ? p1.y : p2.y;

  if (((q.x >= xc1) && (q.x <= xc2)) && ((q.y >= yc1) && (q.y <= yc2))) {
    return true;
  }
  return false;
};


/**
 * Test the envelope defined by p1-p2 for intersection with the envelope defined
 * by q1-q2
 *
 * @param {jsts.geom.Coordinate}
 *          p1 one extremal point of the envelope P.
 * @param {jsts.geom.Coordinate}
 *          p2 another extremal point of the envelope P.
 * @param {jsts.geom.Coordinate}
 *          q1 one extremal point of the envelope Q.
 * @param {jsts.geom.Coordinate}
 *          q2 another extremal point of the envelope Q.
 * @return {boolean} <code>true</code> if Q intersects P.
 */
jsts.geom.Envelope.intersectsEnvelope = function(p1, p2, q1, q2) {
  var minq = Math.min(q1.x, q2.x);
  var maxq = Math.max(q1.x, q2.x);
  var minp = Math.min(p1.x, p2.x);
  var maxp = Math.max(p1.x, p2.x);

  if (minp > maxq) {
    return false;
  }
  if (maxp < minq) {
    return false;
  }

  minq = Math.min(q1.y, q2.y);
  maxq = Math.max(q1.y, q2.y);
  minp = Math.min(p1.y, p2.y);
  maxp = Math.max(p1.y, p2.y);

  if (minp > maxq) {
    return false;
  }
  if (maxp < minq) {
    return false;
  }
  return true;
};


/**
 * @return {jsts.geom.Envelope} A new instance copied from this.
 */
jsts.geom.Envelope.prototype.clone = function() {
  return new jsts.geom.Envelope(this.minx, this.miny, this.maxx, this.maxy);
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Supplies a set of utility methods for building Geometry objects from lists
 * of Coordinates.
 *
 * Note that the factory constructor methods do <b>not</b> change the input
 * coordinates in any way.
 *
 * In particular, they are not rounded to the supplied <tt>PrecisionModel</tt>.
 * It is assumed that input Coordinates meet the given precision.
 *
 * Constructs a GeometryFactory that generates Geometries having a floating
 * PrecisionModel and a spatial-reference ID of 0.
 *
 * @constructor
 */
jsts.geom.GeometryFactory = function() {

};


/**
 * Creates a Point using the given Coordinate; a null Coordinate will create an
 * empty Geometry.
 *
 * @param {Coordinate}
 *          coordinate Coordinate to base this Point on.
 * @return {Point} A new Point.
 */
jsts.geom.GeometryFactory.prototype.createPoint = function(coordinate) {
  if (coordinate === null) {
    return new jsts.geom.Point();
  }
  return new jsts.geom.Point(coordinate);
};


/**
 * Creates a LineString using the given Coordinates; a null or empty array will
 * create an empty LineString. Consecutive points must not be equal.
 *
 * @param {Coordinate[]}
 *          coordinates an array without null elements, or an empty array, or
 *          null.
 * @return {LineString} A new LineString.
 */
jsts.geom.GeometryFactory.prototype.createLineString = function(coordinates) {
  return new jsts.geom.LineString(coordinates);
};


/**
 * Creates a LinearRing using the given Coordinates; a null or empty array will
 * create an empty LinearRing. The points must form a closed and simple
 * linestring. Consecutive points must not be equal.
 *
 * @param {Coordinate[]}
 *          coordinates an array without null elements, or an empty array, or
 *          null.
 * @return {LinearRing} A new LinearRing.
 */
jsts.geom.GeometryFactory.prototype.createLinearRing = function(coordinates) {
  return new jsts.geom.LinearRing(coordinates);
};


/**
 * Constructs a <code>Polygon</code> with the given exterior boundary and
 * interior boundaries.
 *
 * @param {LinearRing}
 *          shell the outer boundary of the new <code>Polygon</code>, or
 *          <code>null</code> or an empty <code>LinearRing</code> if the
 *          empty geometry is to be created.
 * @param {LinearRing[]}
 *          holes the inner boundaries of the new <code>Polygon</code>, or
 *          <code>null</code> or empty <code>LinearRing</code> s if the
 *          empty geometry is to be created.
 * @return {Polygon} A new Polygon.
 */
jsts.geom.GeometryFactory.prototype.createPolygon = function(shell, holes) {
  var rings = [shell];

  if (holes !== undefined) {
    rings = rings.concat(holes);
  }

  return new jsts.geom.Polygon(rings);
};

jsts.geom.GeometryFactory.prototype.createGeometryCollection = function() {
  return new jsts.geom.GeometryCollection();
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geom/Geometry.js
 */



/**
 * @constructor
 * @augments OpenLayers.Geometry.LineString
 * @augments jsts.geom.Geometry
 */
jsts.geom.LineString = function() {

};
jsts.geom.LineString = OpenLayers.Class(jsts.geom.Geometry);


/**
 * @return {jsts.geom.Coordinate[]} this LineString's internal coordinate array.
 */
jsts.geom.LineString.prototype.getCoordinates = function() {
  return this.components;
};


/**
 * @return {jsts.geom.Coordinate} The n'th coordinate of this LineString.
 * @param {int}
 *          n index.
 */
jsts.geom.LineString.prototype.getCoordinateN = function(n) {
  return this.components[n];
};


/**
 * @return {jsts.geom.Coordinate} The first coordinate of this LineString or
 *         null if empty.
 */
jsts.geom.LineString.prototype.getCoordinate = function() {
  if (this.isEmpty()) {
    return null;
  }
  return this.getCoordinateN(0);
};


/**
 * @return {int} LineStrings are always 1-dimensional.
 */
jsts.geom.LineString.prototype.getDimension = function() {
  return 1;
};


/**
 * @return {int} dimension of the boundary of this LineString.
 */
jsts.geom.LineString.prototype.getBoundaryDimension = function() {
  if (this.isClosed()) {
    return Dimension.FALSE;
  }
  return 0;
};


/**
 * @return {Boolean} true if empty.
 */
jsts.geom.LineString.prototype.isEmpty = function() {
  return this.components.length === 0;
};


/**
 * @return {Boolean} true if LineString is Closed.
 */
jsts.geom.LineString.prototype.isClosed = function() {
  if (this.isEmpty()) {
    return false;
  }
  return this.getCoordinateN(0).equals2D(
      this.getCoordinateN(this.components.length - 1));
};


/**
 * @return {Boolean} true if LineString is a Ring.
 */
jsts.geom.LineString.prototype.isRing = function() {
  return this.isClosed() && this.isSimple();
};


/**
 * @return {String} String representation of LineString type.
 */
jsts.geom.LineString.prototype.getGeometryType = function() {
  return 'LineString';
};


/**
 * Gets the boundary of this geometry.
 * The boundary of a lineal geometry is always a zero-dimensional geometry (which may be empty).
 *
 * @return {Geometry} the boundary geometry.
 * @see Geometry#getBoundary
 */
jsts.geom.LineString.prototype.getBoundary = function() {
  return (new jsts.operation.BoundaryOp(this)).getBoundary();
};


jsts.geom.LineString.prototype.computeEnvelopeInternal = function() {
  if (this.isEmpty()) {
    return new jsts.geom.Envelope();
  }

  var env = new jsts.geom.Envelope();
  for (var i = 0; i < this.components.length; i++) {
    var point = this.components[i];
    env.expandToInclude(point);
  }

  return env;
};


/**
 * @param {Geometry}
 *          other Geometry to compare this LineString to.
 * @param {double}
 *          tolerance Tolerance.
 * @return {Boolean} true if equal.
 */
jsts.geom.LineString.prototype.equalsExact = function(other, tolerance) {
  var i;

  if (!this.isEquivalentClass(other)) {
    return false;
  }
  if (this.components.length !== other.components.length) {
    return false;
  }
  for (i = 0; i < this.components.length; i++) {
    if (!jsts.geom.Geometry.prototype.equal(this.components[i], other.components[i],
        tolerance)) {
      return false;
    }
  }
  return true;
};


/**
 * Creates and returns a full copy of this {@link LineString} object. (including
 * all coordinates contained by it).
 *
 * @return {jsts.geom.LineString} a clone of this instance.
 */
jsts.geom.LineString.prototype.clone = function() {
  var key, coordinate;

  var points = [];
  for (key in this.components) {
    if (this.components.hasOwnProperty(key)) {
      coordinate = this.components[key];
      points.push(coordinate.clone());
    }
  }

  var clone = new jsts.geom.LineString(points);

  return clone;
};

jsts.geom.LineString.prototype.apply = function(filter) {
  filter.filter(this);
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geom/GeometryCollection.js
 */



/**
 * @constructor
 * @augments OpenLayers.Geometry.LineString
 * @augments jsts.geom.Geometry
 */
jsts.geom.MultiLineString = function() {

};
jsts.geom.MultiLineString = OpenLayers.Class(jsts.geom.GeometryCollection);

jsts.geom.MultiLineString.prototype.getBoundary = function() {
  return (new jsts.operation.BoundaryOp(this)).getBoundary();
};


/**
 * @param {Geometry} other
 * @param {double} tolerance
 * @return {boolean}
 */
jsts.geom.MultiLineString.prototype.equalsExact = function(other, tolerance) {
  if (!this.isEquivalentClass(other)) {
    return false;
  }
  return jsts.geom.GeometryCollection.prototype.equalsExact.call(this, other, tolerance);
};

OpenLayers.Geometry.MultiLineString = OpenLayers.Class(
    OpenLayers.Geometry.MultiLineString, jsts.geom.MultiLineString);
jsts.geom.MultiLineString = OpenLayers.Geometry.MultiLineString;

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Models an OGC SFS <code>LinearRing</code>.
 * A LinearRing is a LineString which is both closed and simple.
 * In other words,
 * the first and last coordinate in the ring must be equal,
 * and the interior of the ring must not self-intersect.
 * Either orientation of the ring is allowed.
 * <p>
 * A ring must have either 0 or 4 or more points.
 * The first and last points must be equal (in 2D).
 * If these conditions are not met, the constructors throw
 * an {@link IllegalArgumentException}
 *
 * @requires jsts/geom/LineString.js
 */



/**
 * @constructor
 * @augments OpenLayers.Geometry.LinearRing
 * @augments jsts.geom.LineString
 */
jsts.geom.LinearRing = function() {
};
jsts.geom.LinearRing = OpenLayers.Class(jsts.geom.LineString);


/**
 * Returns <code>Dimension.FALSE</code>, since by definition LinearRings do
 * not have a boundary.
 *
 * @return {int} Dimension.FALSE.
 */
jsts.geom.LinearRing.prototype.getBoundaryDimension = function() {
  return jsts.geom.Dimension.FALSE;
};


/**
 * Returns <code>true</code>, since by definition LinearRings are always
 * simple.
 *
 * @return {Boolean} <code>true.</code>
 *
 * @see Geometry#isSimple
 */
jsts.geom.LinearRing.prototype.isSimple = function() {
  return true;
};


/**
 * @return {String} String representation of LinearRing type.
 */
jsts.geom.LinearRing.prototype.getGeometryType = function() {
  return 'LinearRing';
};


OpenLayers.Geometry.LinearRing = OpenLayers.Class(
    OpenLayers.Geometry.LinearRing, jsts.geom.LinearRing);
jsts.geom.LinearRing = OpenLayers.Geometry.LinearRing;

OpenLayers.Geometry.LineString = OpenLayers.Class(
    OpenLayers.Geometry.LineString, jsts.geom.LineString, {
      initialize: function(points) {
        OpenLayers.Geometry.Curve.prototype.initialize.apply(this, arguments);

        this.geometries = this.components;
      }
    });
jsts.geom.LineString = OpenLayers.Geometry.LineString;

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Represents a line segment defined by two {@link Coordinate}s. Provides
 * methods to compute various geometric properties and relationships of line
 * segments.
 * <p>
 * This class is designed to be easily mutable (to the extent of having its
 * contained points public). This supports a common pattern of reusing a single
 * LineSegment object as a way of computing segment properties on the segments
 * defined by arrays or lists of {@link Coordinate}s.
 *
 * @param {Coordinate}
 *          p0
 * @param {Coordinate}
 *          p1
 * @constructor
 */
jsts.geom.LineSegment = function(p0, p1) {
  this.p0 = p0;
  this.p1 = p1;
};


/**
 * @type {Coordinate}
 */
jsts.geom.LineSegment.prototype.p0 = null;


/**
 * @type {Coordinate}
 */
jsts.geom.LineSegment.prototype.p1 = null;


/**
 * Computes the Projection Factor for the projection of the point p onto this
 * LineSegment. The Projection Factor is the constant r by which the vector for
 * this segment must be multiplied to equal the vector for the projection of
 * <tt>p<//t> on the line
 * defined by this segment.
 * <p>
 * The projection factor returned will be in the range <tt>(-inf, +inf)</tt>.
 *
 * @param {Coordinate} p the point to compute the factor for.
 * @return {double} the projection factor for the point.
 */
jsts.geom.LineSegment.prototype.projectionFactor = function(p) {
  if (p.equals(this.p0))
    return 0.0;
  if (p.equals(this.p1))
    return 1.0;
  // Otherwise, use comp.graphics.algorithms Frequently Asked Questions method
  /*            AC dot AB
                 r = ---------
                       ||AB||^2
              r has the following meaning:
              r=0 P = A
              r=1 P = B
              r<0 P is on the backward extension of AB
              r>1 P is on the forward extension of AB
              0<r<1 P is interior to AB
      */
  var dx = this.p1.x - this.p0.x;
  var dy = this.p1.y - this.p0.y;
  var len2 = dx * dx + dy * dy;
  var r = ((p.x - this.p0.x) * dx + (p.y - this.p0.y) * dy) / len2;
  return r;
};


/**
 * Computes the closest point on this line segment to another point.
 *
 * @param {Coordinate}
 *          p the point to find the closest point to.
 * @return {Coordinate} a Coordinate which is the closest point on the line
 *         segment to the point p.
 */
jsts.geom.LineSegment.prototype.closestPoint = function(p) {
  var factor = this.projectionFactor(p);
  if (factor > 0 && factor < 1) {
    return this.project(p);
  }
  var dist0 = this.p0.distance(p);
  var dist1 = this.p1.distance(p);
  if (dist0 < dist1)
    return this.p0;
  return this.p1;
};


/**
 * Computes the closest points on two line segments.
 *
 * @param {LineSegment}
 *          line the segment to find the closest point to.
 * @return {[]} a pair of Coordinates which are the closest points on the line
 *         segments.
 */
jsts.geom.LineSegment.prototype.closestPoints = function(line) {
  // test for intersection
  var intPt = this.intersection(line);
  if (intPt !== null) {
    return [intPt, intPt];
  }

  /**
   * if no intersection closest pair contains at least one endpoint. Test each
   * endpoint in turn.
   */
  var closestPt = [];
  var minDistance = Number.MAX_VALUE;
  var dist;

  var close00 = this.closestPoint(line.p0);
  minDistance = close00.distance(line.p0);
  closestPt[0] = close00;
  closestPt[1] = line.p0;

  var close01 = this.closestPoint(line.p1);
  dist = close01.distance(line.p1);
  if (dist < minDistance) {
    minDistance = dist;
    closestPt[0] = close01;
    closestPt[1] = line.p1;
  }

  var close10 = line.closestPoint(this.p0);
  dist = close10.distance(this.p0);
  if (dist < minDistance) {
    minDistance = dist;
    closestPt[0] = this.p0;
    closestPt[1] = close10;
  }

  var close11 = line.closestPoint(this.p1);
  dist = close11.distance(this.p1);
  if (dist < minDistance) {
    minDistance = dist;
    closestPt[0] = this.p1;
    closestPt[1] = close11;
  }

  return closestPt;
};


/**
 * Computes an intersection point between two line segments, if there is one.
 * There may be 0, 1 or many intersection points between two segments. If there
 * are 0, null is returned. If there is 1 or more, exactly one of them is
 * returned (chosen at the discretion of the algorithm). If more information is
 * required about the details of the intersection, the
 * {@link RobustLineIntersector} class should be used.
 *
 * @param {LineSegment}
 *          line a line segment.
 * @return {Coordinate} an intersection point, or <code>null</code> if there
 *         is none.
 *
 * @see RobustLineIntersector
 */
jsts.geom.LineSegment.prototype.intersection = function(line) {
  var li = new jsts.algorithm.RobustLineIntersector();
  li.computeIntersection(this.p0, this.p1, line.p0, line.p1);
  if (li.hasIntersection())
    return li.getIntersection(0);
  return null;
};


/**
 * Compute the projection of a point onto the line determined by this line
 * segment.
 * <p>
 * Note that the projected point may lie outside the line segment. If this is
 * the case, the projection factor will lie outside the range [0.0, 1.0].
 *
 * @param {Coordinate}
 *          p
 * @return {Coordinate}
 */
jsts.geom.LineSegment.prototype.project = function(p) {
  if (p.equals(this.p0) || p.equals(this.p1))
    return new jsts.geom.Coordinate(p);

  var r = this.projectionFactor(p);
  var coord = new jsts.geom.Coordinate();
  coord.x = this.p0.x + r * (this.p1.x - this.p0.x);
  coord.y = this.p0.y + r * (this.p1.y - this.p0.y);
  return coord;
};

// TODO: port rest

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


/**
 * @requires jsts/geom/Coordinate.js
 */



/**
 * @constructor
 * @augments jsts.geom.Coordinate
 */
jsts.geom.Point = function() {
};

jsts.geom.Point = OpenLayers.Class(jsts.geom.Geometry, {
  initialize: function(coordinate) {
    if (coordinate === undefined)
      return;

    this.coordinate = coordinate;
  }
});


jsts.geom.Point.prototype.coordinate = null;

jsts.geom.Point.prototype.getCoordinate = function() {
  return this.coordinate;
};

jsts.geom.Point.prototype.isEmpty = function() {
  return this.coordinate === null;
};

jsts.geom.Point.prototype.equalsExact = function(other, tolerance) {
  if (!this.isEquivalentClass(other)) {
    return false;
  }
  if (this.isEmpty() && other.isEmpty()) {
    return true;
  }
  return this.equal(other.getCoordinate(), this.getCoordinate(), tolerance);
};


/**
 * Gets the boundary of this geometry. Zero-dimensional geometries have no
 * boundary by definition, so an empty GeometryCollection is returned.
 *
 * @return {GeometryCollection} an empty GeometryCollection.
 * @see Geometry#getBoundary
 */
jsts.geom.Point.prototype.getBoundary = function() {
  return new jsts.geom.GeometryCollection(null);
};


/**
 * @return {Envelope} Envelope of this point.
 */
jsts.geom.Point.prototype.computeEnvelopeInternal = function() {
  if (this.isEmpty()) {
    return new jsts.geom.Envelope();
  }
  return new jsts.geom.Envelope(this);
};

jsts.geom.Point.prototype.apply = function(filter) {
  filter.filter(this);
};

jsts.geom.Point.prototype.clone = function() {
  return new jsts.geom.Point(this.coordinate.clone());
};


/**
 * @return {int} Always 0.
 */
jsts.geom.Point.prototype.getDimension = function() {
  return 0;
};


/**
 * @return {int} Always Dimension.FALSE.
 */
jsts.geom.Point.prototype.getBoundaryDimension = function() {
  return jsts.geom.Dimension.FALSE;
};


/**
 * @return {String} String representation of Point type.
 */
jsts.geom.Point.prototype.getGeometryType = function() {
  return 'Point';
};

jsts.geom.Point.prototype.hashCode = function() {
  return 'Point_' + this.coordinate.hashCode();
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geom/GeometryCollection.js
 */



/**
 * @constructor
 * @augments OpenLayers.Geometry.LineString
 * @augments jsts.geom.Geometry
 */
jsts.geom.MultiPoint = function() {

};
jsts.geom.MultiPoint = OpenLayers.Class(jsts.geom.GeometryCollection);


/**
 * Gets the boundary of this geometry.
 * Zero-dimensional geometries have no boundary by definition,
 * so an empty GeometryCollection is returned.
 *
 * @return {Geometry} an empty GeometryCollection.
 * @see Geometry#getBoundary
 */
jsts.geom.MultiPoint.prototype.getBoundary = function() {
  return this.getFactory().createGeometryCollection(null);
};

jsts.geom.MultiPoint.prototype.getGeometryN = function(n) {
  return new jsts.geom.Point(this.geometries[n]);
};


/**
 * @param {Geometry} other
 * @param {double} tolerance
 * @return {boolean}
 */
jsts.geom.MultiPoint.prototype.equalsExact = function(other, tolerance) {
  if (!this.isEquivalentClass(other)) {
    return false;
  }
  return jsts.geom.GeometryCollection.prototype.equalsExact.call(this, other, tolerance);
};

OpenLayers.Geometry.MultiPoint = OpenLayers.Class(
    OpenLayers.Geometry.MultiPoint, jsts.geom.MultiPoint);
jsts.geom.MultiPoint = OpenLayers.Geometry.MultiPoint;

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Represents a linear polygon, which may include holes.
 * The shell and holes of the polygon are represented by {@link LinearRing}s.
 * In a valid polygon, holes may touch the shell or other holes at a single
 * point. However, no sequence of touching holes may split the polygon into
 * two pieces. The orientation of the rings in the polygon does not matter.
 *
 * The shell and holes must conform to the assertions specified in the <A
 * HREF="http://www.opengis.org/techno/specs.htm">OpenGIS Simple Features
 * Specification for SQL</A>.
 */



/**
 * @augments OpenLayers.Geometry.MultiPolygon
 * @augments jsts.geom.Geometry
 * @constructor
 */
jsts.geom.Polygon = function() {

};

jsts.geom.Polygon = OpenLayers.Class(jsts.geom.Geometry);


jsts.geom.Polygon.prototype.getCoordinate = function() {
  return this.components[0].getCoordinate();
};


/**
 * @return {boolean}
 */
jsts.geom.Polygon.prototype.isEmpty = function() {
  for (var i = 0; i < this.geometries.length; i++) {
    if (!this.geometries[i].isEmpty()) {
      return false;
    }
  }
  return true;
};


jsts.geom.Polygon.prototype.getExteriorRing = function() {
  return this.components[0];
};

jsts.geom.Polygon.prototype.getInteriorRingN = function(n) {
  var holes = this.components.slice(1);
  return holes[n];
};

jsts.geom.Polygon.prototype.getNumInteriorRing = function() {
  return this.components.slice(1).length;
};


/**
 * Computes the boundary of this geometry
 *
 * @return {Geometry} a lineal geometry (which may be empty).
 * @see Geometry#getBoundary
 */
jsts.geom.Polygon.prototype.getBoundary = function() {
  if (this.isEmpty()) {
    return this.getFactory().createMultiLineString(null);
  }
  var rings = [];
  var shell = this.components[0];
  rings[0] = shell;
  var holes = this.components.slice(1);
  for (var i = 0; i < holes.length; i++) {
    rings[i + 1] = holes[i];
  }
  // create LineString or MultiLineString as appropriate
  if (rings.length <= 1)
    return this.getFactory().createLinearRing(rings[0].getCoordinateSequence());
  return this.getFactory().createMultiLineString(rings);
};

jsts.geom.Polygon.prototype.computeEnvelopeInternal = function() {
  var shell = this.components[0];

  return shell.getEnvelopeInternal();
};

jsts.geom.Polygon.prototype.getDimension = function() {
  return 2;
};

jsts.geom.Polygon.prototype.getBoundaryDimension = function() {
  return 1;
};


/**
 * @param {Geometry} other
 * @param {double} tolerance
 * @return {boolean}
 */
jsts.geom.Polygon.prototype.equalsExact = function(other, tolerance) {
  if (!this.isEquivalentClass(other)) {
    return false;
  }
  if (this.isEmpty() && other.isEmpty()) {
    return true;
  }

  var holes = this.components.slice(1);
  var otherPolygon = other;
  var thisShell = this.components[0];
  var otherPolygonShell = otherPolygon.components[0];
  var otherPolygonHoles = otherPolygon.components.slice(1);
  if (!thisShell.equalsExact(otherPolygonShell, tolerance)) {
    return false;
  }
  if (holes.length !== otherPolygonHoles.length) {
    return false;
  }
  if (holes.length !== otherPolygonHoles.length) {
    return false;
  }
  for (var i = 0; i < holes.length; i++) {
    if (!(holes[i]).equalsExact(otherPolygonHoles[i], tolerance)) {
      return false;
    }
  }
  return true;
};

jsts.geom.Polygon.prototype.apply = function(filter) {
  filter.filter(this);
  if (filter instanceof jsts.geom.GeometryComponentFilter) {
    var shell = this.components[0];
    shell.apply(filter);
    var holes = this.components.slice(1);
    for (var i = 0; i < holes.length; i++) {
      holes[i].apply(filter);
    }
  }
};

OpenLayers.Geometry.Polygon = OpenLayers.Class(OpenLayers.Geometry.Polygon,
    jsts.geom.Polygon);
jsts.geom.Polygon = OpenLayers.Geometry.Polygon;

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


/**
 * @requires jsts/geom/GeometryCollection.js
 */



/**
 * @constructor
 * @augments OpenLayers.Geometry.MultiPolygon
 * @augments jsts.geom.GeometryCollection
 */
jsts.geom.MultiPolygon = function() {

};
jsts.geom.MultiPolygon = OpenLayers.Class(jsts.geom.GeometryCollection);


/**
 * Computes the boundary of this geometry
 *
 * @return {Geometry} a lineal geometry (which may be empty).
 * @see Geometry#getBoundary
 */
jsts.geom.MultiPolygon.prototype.getBoundary = function() {
  if (this.isEmpty()) {
    return this.getFactory().createMultiLineString(null);
  }
  var allRings = [];
  for (var i = 0; i < this.geometries.length; i++) {
    var polygon = this.geometries[i];
    var rings = polygon.getBoundary();
    for (var j = 0; j < rings.getNumGeometries(); j++) {
      allRings.push(rings.getGeometryN(j));
    }
  }
  return this.getFactory().createMultiLineString(allRings);
};


/**
 * @param {Geometry} other
 * @param {double} tolerance
 * @return {boolean}
 */
jsts.geom.MultiPolygon.prototype.equalsExact = function(other, tolerance) {
  if (!this.isEquivalentClass(other)) {
    return false;
  }
  return jsts.geom.GeometryCollection.prototype.equalsExact.call(this, other, tolerance);
};

OpenLayers.Geometry.MultiPolygon = OpenLayers.Class(
    OpenLayers.Geometry.MultiPolygon, jsts.geom.MultiPolygon);
jsts.geom.MultiPolygon = OpenLayers.Geometry.MultiPolygon;

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Specifies the precision model of the {@link Coordinate}s in a
 * {@link Geometry}. In other words, specifies the grid of allowable points for
 * all <code>Geometry</code>s.
 * <p>
 * The {@link makePrecise} method allows rounding a coordinate to a "precise"
 * value; that is, one whose precision is known exactly.
 * <p>
 * Coordinates are assumed to be precise in geometries. That is, the coordinates
 * are assumed to be rounded to the precision model given for the geometry. JTS
 * input routines automatically round coordinates to the precision model before
 * creating Geometries. All internal operations assume that coordinates are
 * rounded to the precision model. Constructive methods (such as boolean
 * operations) always round computed coordinates to the appropriate precision
 * model.
 * <p>
 * Currently one type of precision model are supported:
 * <ul>
 * <li>FLOATING - represents full double precision floating point.
 * <p>
 * Coordinates are represented internally as Java double-precision values. Since
 * Java uses the IEEE-754 floating point standard, this provides 53 bits of
 * precision.
 * <p>
 * JSTS methods currently do not handle inputs with different precision models.
 *
 * @constructor
 */
jsts.geom.PrecisionModel = function() {

};


/**
 * @type {int}
 */
jsts.geom.PrecisionModel.FLOATING = 0;


/**
 * @type {int}
 */
jsts.geom.PrecisionModel.FIXED = 1;


/**
 * @return {boolean} always true.
 */
jsts.geom.PrecisionModel.prototype.isFloating = function() {
  return true;
};


/**
 * @return {int} always jsts.geom.PrecisionModel.FLOATING.
 */
jsts.geom.PrecisionModel.prototype.getType = function() {
  return jsts.geom.PrecisionModel.FLOATING;
};

jsts.geom.PrecisionModel.prototype.equals = function(other) {
  return true;

  //TODO: needs to be ported for fixed precision

  /*if (!(other instanceof PrecisionModel)) {
    return false;
  }
  var otherPrecisionModel = other;
  return this.modelType == otherPrecisionModel.modelType &&
      this.scale == otherPrecisionModel.scale;*/
};


/**
 * Compares this {@link PrecisionModel} object with the specified object for
 * order. A PrecisionModel is greater than another if it provides greater
 * precision. The comparison is based on the value returned by the
 * {@link #getMaximumSignificantDigits} method. This comparison is not strictly
 * accurate when comparing floating precision models to fixed models; however,
 * it is correct when both models are either floating or fixed.
 *
 * @param o
 *          the <code>PrecisionModel</code> with which this
 *          <code>PrecisionModel</code> is being compared.
 * @return a negative integer, zero, or a positive integer as this
 *         <code>PrecisionModel</code> is less than, equal to, or greater than
 *         the specified <code>PrecisionModel.</code>
 */
jsts.geom.PrecisionModel.prototype.compareTo = function(o) {
  var other = o;

  // TODO: needs to be ported for fixed precision

  // var sigDigits = this.getMaximumSignificantDigits();
  // var otherSigDigits = other.getMaximumSignificantDigits();
  // return (new Integer(sigDigits)).compareTo(new Integer(otherSigDigits));

  return 0;
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


/**
 * @namespace
 */
jsts.geom.util = {};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geom/GeometryComponentFilter.js
 */



/**
 * Extracts all the 1-dimensional ({@link LineString}) components from a
 * {@link Geometry}.
 *
 * @augments GeometryComponentFilter
 * @constructor
 */
jsts.geom.util.LinearComponentExtracter = function(lines, isForcedToLineString) {
  this.lines = lines;
  this.isForcedToLineString = isForcedToLineString;
};

jsts.geom.util.LinearComponentExtracter.prototype = new jsts.geom.GeometryComponentFilter();


/**
 * @private
 */
jsts.geom.util.LinearComponentExtracter.prototype.lines = null;


/**
 * @private
 */
jsts.geom.util.LinearComponentExtracter.prototype.isForcedToLineString = false;


/**
 * Extracts the linear components from a single {@link Geometry} and adds them
 * to the provided {@link Collection}.
 *
 * NOTE: will call "overloaded" function depending on args.
 *
 * @param {[]}
 *          geoms the collection of geometries from which to extract linear
 *          components.
 * @param {[]}
 *          lines the collection to add the extracted linear components to.
 * @return {[]} the collection of linear components (LineStrings or
 *         LinearRings).
 */
jsts.geom.util.LinearComponentExtracter.getLines = function(geoms, lines) {
  if (arguments.length == 1) {
    return jsts.geom.util.LinearComponentExtracter.getLines5.apply(this, arguments);
  }
  else if (arguments.length == 2 && typeof lines === 'boolean') {
    return jsts.geom.util.LinearComponentExtracter.getLines6.apply(this, arguments);
  }
  else if (arguments.length == 2 && geoms instanceof jsts.geom.Geometry) {
    return jsts.geom.util.LinearComponentExtracter.getLines3.apply(this, arguments);
  }
  else if (arguments.length == 3 && geoms instanceof jsts.geom.Geometry) {
    return jsts.geom.util.LinearComponentExtracter.getLines4.apply(this, arguments);
  }
  else if (arguments.length == 3) {
    return jsts.geom.util.LinearComponentExtracter.getLines2.apply(this, arguments);
  }

  for (var i = 0; i < geoms.length; i++) {
    var g = geoms[i];
    jsts.geom.util.LinearComponentExtracter.getLines3(g, lines);
  }
  return lines;
};


/**
 * Extracts the linear components from a single {@link Geometry} and adds them
 * to the provided {@link Collection}.
 *
 * @param {[]}
 *          geoms the Collection of geometries from which to extract linear
 *          components.
 * @param {[]}
 *          lines the collection to add the extracted linear components to.
 * @param {boolean}
 *          forceToLineString true if LinearRings should be converted to
 *          LineStrings.
 * @return {[]} the collection of linear components (LineStrings or
 *         LinearRings).
 */
jsts.geom.util.LinearComponentExtracter.getLines2 = function(geoms, lines,
    forceToLineString) {
  for (var i = 0; i < geoms.length; i++) {
    var g = geoms[i];
    jsts.geom.util.LinearComponentExtracter.getLines4(g, lines,
        forceToLineString);
  }
  return lines;
};


/**
 * Extracts the linear components from a single {@link Geometry} and adds them
 * to the provided {@link Collection}.
 *
 * @param {Geometry}
 *          geom the geometry from which to extract linear components.
 * @param {[]}
 *          lines the Collection to add the extracted linear components to.
 * @return {[]} the Collection of linear components (LineStrings or
 *         LinearRings).
 */
jsts.geom.util.LinearComponentExtracter.getLines3 = function(geom, lines) {
  if (geom instanceof LineString) {
    lines.add(geom);
  } else {
    geom.apply(new jsts.geom.util.LinearComponentExtracter(lines));
  }
  return lines;
};


/**
 * Extracts the linear components from a single {@link Geometry} and adds them
 * to the provided {@link Collection}.
 *
 * @param {Geometry}
 *          geom the geometry from which to extract linear components.
 * @param {[]}
 *          lines the Collection to add the extracted linear components to.
 * @param {boolean}
 *          forceToLineString true if LinearRings should be converted to
 *          LineStrings.
 * @return {[]} the Collection of linear components (LineStrings or
 *         LinearRings).
 */
jsts.geom.util.LinearComponentExtracter.getLines4 = function(geom, lines,
    forceToLineString) {
  geom.apply(new jsts.geom.util.LinearComponentExtracter(lines,
      forceToLineString));
  return lines;
};


/**
 * Extracts the linear components from a single geometry. If more than one
 * geometry is to be processed, it is more efficient to create a single
 * {@link LinearComponentExtracter} instance and pass it to multiple geometries.
 *
 * @param {Geometry}
 *          geom the geometry from which to extract linear components.
 * @return {[]} the list of linear components.
 */
jsts.geom.util.LinearComponentExtracter.getLines5 = function(geom) {
  return jsts.geom.util.LinearComponentExtracter.getLines6(geom, false);
};


/**
 * Extracts the linear components from a single geometry. If more than one
 * geometry is to be processed, it is more efficient to create a single
 * {@link LinearComponentExtracter} instance and pass it to multiple geometries.
 *
 * @param {Geometry}
 *          geom the geometry from which to extract linear components.
 * @param {boolean}
 *          forceToLineString true if LinearRings should be converted to
 *          LineStrings.
 * @return {[] the list of linear components.}
 */
jsts.geom.util.LinearComponentExtracter.getLines6 = function(geom,
    forceToLineString) {
  var lines = [];
  geom.apply(new jsts.geom.util.LinearComponentExtracter(lines,
      forceToLineString));
  return lines;
};


/**
 * Indicates that LinearRing components should be converted to pure LineStrings.
 *
 * @param {boolean}
 *          isForcedToLineString true if LinearRings should be converted to
 *          LineStrings.
 */
jsts.geom.util.LinearComponentExtracter.prototype.setForceToLineString = function(
    isForcedToLineString) {
  this.isForcedToLineString = isForcedToLineString;
};

jsts.geom.util.LinearComponentExtracter.prototype.filter = function(geom) {
  if (this.isForcedToLineString && geom instanceof jsts.geom.LinearRing) {
    var line = geom.getFactory().createLineString(geom.getCoordinateSequence());
    this.lines.push(line);
    return;
  }
  // if not being forced, and this is a linear component
  // NOTE: inheritance will not show LinearRing to be of LineString heritance...
  if (geom instanceof jsts.geom.LineString || geom instanceof jsts.geom.LinearRing)
    this.lines.push(geom);

  // else this is not a linear component, so skip it
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geom/GeometryFilter.js
 */



/**
 * Constructs a filter with a list in which to store the elements found.
 *
 * @param clz the class of the components to extract (null means all types).
 * @param {[]} comps the list to extract into.
 * @augments GeometryFilter
 * @constructor
 */
jsts.geom.util.GeometryExtractor = function(clz, comps) {
  this.clz = clz;
  this.comps = comps;
};

jsts.geom.util.GeometryExtractor.prototype = new jsts.geom.GeometryFilter();


/**
 * @private
 */
jsts.geom.util.GeometryExtractor.prototype.clz = null;


/**
 * @private
 */
jsts.geom.util.GeometryExtractor.prototype.comps = null;


/**
 * Extracts the components of type <tt>clz</tt> from a {@link Geometry}
 * and adds them to the provided {@link List} if provided.
 *
 * @param {Geometry} geom the geometry from which to extract.
 * @param {Object} clz
 * @param {[]} [list] the list to add the extracted elements to.
 *
 * @return {[]}
 */
jsts.geom.util.GeometryExtractor.extract = function(geom, clz, list) {
  list = list || [];
  if (geom instanceof clz) {
    list.add(geom);
  }
  else if (geom instanceof jsts.geom.GeometryCollection) {
    geom.apply(new jsts.geom.util.GeometryExtractor(clz, list));
  }
  //skip non-LineString elemental geometries

  return list;
};


/**
 * @param {Geometry} geom
 */
jsts.geom.util.GeometryExtractor.prototype.filter = function(geom) {
  if (this.clz === null || geom instanceof this.clz) {
    this.comps.push(geom);
  }
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geom/GeometryFilter.js
 */



/**
 * Extracts all the 0-dimensional ({@link Point}) components from a
 * {@link Geometry}.
 *
 * Constructs a PointExtracterFilter with a list in which to store Points found.
 *
 * @augments GeometryFilter
 * @see GeometryExtracter
 * @constructor
 */
jsts.geom.util.PointExtracter = function(pts) {
  this.pts = pts;
};

jsts.geom.util.PointExtracter.prototype = new jsts.geom.GeometryFilter();


/**
 * @private
 */
jsts.geom.util.PointExtracter.prototype.pts = null;


/**
 * Extracts the {@link Point} elements from a single {@link Geometry} and adds
 * them to the provided {@link List}.
 *
 * @param {Geometry}
 *          geom the geometry from which to extract.
 * @param {[]}
 *          list the list to add the extracted elements to.
 * @return {[]}
 */
jsts.geom.util.PointExtracter.getPoints = function(geom, list) {
  if (list === undefined) {
    list = [];
  }

  if (geom instanceof jsts.geom.Point) {
    list.push(geom);
  } else if (geom instanceof jsts.geom.GeometryCollection) {
    geom.apply(new jsts.geom.util.PointExtracter(list));
  }
  // skip non-Polygonal elemental geometries

  return list;
};

jsts.geom.util.PointExtracter.prototype.filter = function(geom) {
  if (geom instanceof jsts.geom.Point)
    this.pts.push(geom);
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geom/GeometryFilter.js
 */



/**
 * Extracts all the {@link Polygon} elements from a {@link Geometry}.
 *
 * Constructs a PolygonExtracterFilter with a list in which to store Polygons
 * found.
 *
 * @param {[]}
 *          comps
 * @augments GeometryFilter
 * @see GeometryExtracter
 * @constructor
 */
jsts.geom.util.PolygonExtracter = function(comps) {
  this.comps = comps;
};

jsts.geom.util.PolygonExtracter.prototype = new jsts.geom.GeometryFilter();


/**
 * @private
 */
jsts.geom.util.PolygonExtracter.prototype.comps = null;


/**
 * Extracts the {@link Polygon} elements from a single {@link Geometry} and adds
 * them to the provided {@link List}.
 *
 * @param {Geometry}
 *          geom the geometry from which to extract.
 * @param {[]}
 *          list the list to add the extracted elements to.
 * @return {[]}
 */
jsts.geom.util.PolygonExtracter.getPolygons = function(geom, list) {
  if (list === undefined) {
    list = [];
  }

  if (geom instanceof jsts.geom.Polygon) {
    list.push(geom);
  } else if (geom instanceof jsts.geom.GeometryCollection) {
    geom.apply(new jsts.geom.util.PolygonExtracter(list));
  }
  // skip non-Polygonal elemental geometries

  return list;
};


/**
 * @param {Geometry}
 *          geom
 */
jsts.geom.util.PolygonExtracter.prototype.filter = function(geom) {
  if (geom instanceof jsts.geom.Polygon)
    this.comps.push(geom);
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


/**
 * @namespace
 */
jsts.algorithm = {

};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * An interface for rules which determine whether node points which are in
 * boundaries of {@link Lineal} geometry components are in the boundary of the
 * parent geometry collection. The SFS specifies a single kind of boundary node
 * rule, the {@link Mod2BoundaryNodeRule} rule. However, other kinds of Boundary
 * Node Rules are appropriate in specific situations (for instance, linear
 * network topology usually follows the {@link EndPointBoundaryNodeRule}.) Some
 * JTS operations allow the BoundaryNodeRule to be specified, and respect this
 * rule when computing the results of the operation.
 *
 * @see RelateOp
 * @see IsSimpleOp
 * @see PointLocator
 * @constructor
 */
jsts.algorithm.BoundaryNodeRule = function() {

};


/**
 * Tests whether a point that lies in <tt>boundaryCount</tt> geometry
 * component boundaries is considered to form part of the boundary of the parent
 * geometry.
 *
 * @param {int}
 *          boundaryCount the number of component boundaries that this point
 *          occurs in.
 * @return {boolean} true if points in this number of boundaries lie in the
 *         parent boundary.
 */
jsts.algorithm.BoundaryNodeRule.prototype.isInBoundary = function(boundaryCount) {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * A {@link BoundaryNodeRule} specifies that points are in the boundary of a
 * lineal geometry iff the point lies on the boundary of an odd number of
 * components. Under this rule {@link LinearRing}s and closed
 * {@link LineString}s have an empty boundary.
 * <p>
 * This is the rule specified by the <i>OGC SFS</i>, and is the default rule
 * used in JTS.
 */
jsts.algorithm.Mod2BoundaryNodeRule = function() {

};

jsts.algorithm.Mod2BoundaryNodeRule.prototype = new jsts.algorithm.BoundaryNodeRule();

jsts.algorithm.Mod2BoundaryNodeRule.prototype.isInBoundary = function(
    boundaryCount) {
  // the "Mod-2 Rule"
  return boundaryCount % 2 === 1;
};

jsts.algorithm.BoundaryNodeRule.MOD2_BOUNDARY_RULE = new jsts.algorithm.Mod2BoundaryNodeRule();
jsts.algorithm.BoundaryNodeRule.OGC_SFS_BOUNDARY_RULE = jsts.algorithm.BoundaryNodeRule.MOD2_BOUNDARY_RULE;

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * @param {Coordinate}
 *          p00
 * @param {Coordinate}
 *          p01
 * @param {Coordinate}
 *          p10
 * @param {Coordinate}
 *          p11
 * @constructor
 */
jsts.algorithm.CentralEndpointIntersector = function(p00, p01, p10, p11) {
  this.pts = [p00, p01, p10, p11];
  this.compute();
};


/**
 * @param {Coordinate}
 *          p00
 * @param {Coordinate}
 *          p01
 * @param {Coordinate}
 *          p10
 * @param {Coordinate}
 *          p11
 * @return {Coordinate}
 */
jsts.algorithm.CentralEndpointIntersector.getIntersection = function(p00, p01,
    p10, p11) {
  var intor = new jsts.algorithm.CentralEndpointIntersector(p00, p01, p10, p11);
  return intor.getIntersection();
};


/**
 * @type {Coordinate[]}
 * @private
 */
jsts.algorithm.CentralEndpointIntersector.prototype.pts = null;


/**
 * @type {Coordinate}
 * @private
 */
jsts.algorithm.CentralEndpointIntersector.prototype.intPt = null;


/**
 * @private
 */
jsts.algorithm.CentralEndpointIntersector.prototype.compute = function() {
  var centroid = jsts.algorithm.CentralEndpointIntersector.average(this.pts);
  this.intPt = this.findNearestPoint(centroid, this.pts);
};


/**
 * @return {Coordinate}
 */
jsts.algorithm.CentralEndpointIntersector.prototype.getIntersection = function() {
  return this.intPt;
};


/**
 * @param {Coordinate[]}
 *          pts
 * @return {Coordinate}
 * @private
 */
jsts.algorithm.CentralEndpointIntersector.average = function(pts) {
  var avg = new jsts.geom.Coordinate();
  var i, n = pts.length;
  for (i = 0; i < n; i++) {
    avg.x += pts[i].x;
    avg.y += pts[i].y;
  }
  if (n > 0) {
    avg.x /= n;
    avg.y /= n;
  }
  return avg;
};


/**
 * Determines a point closest to the given point.
 *
 * @param {Coordinate}
 *          p the point to compare against.
 * @param {Coordinate[]}
 *          pts
 * @return {Coordinate} the point closest to the input point p.
 * @private
 */
jsts.algorithm.CentralEndpointIntersector.prototype.findNearestPoint = function(
    p, pts) {
  var minDist = Number.MAX_VALUE;
  var i, result = null, dist;
  for (i = 0; i < pts.length; i++) {
    dist = p.distance(pts[i]);
    if (dist < minDist) {
      minDist = dist;
      result = pts[i];
    }
  }
  return result;
};




/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Specifies and implements various fundamental Computational
 * Geometric algorithms. The algorithms supplied in this class are robust
 * for double-precision floating point.
 * @constructor
 */
jsts.algorithm.CGAlgorithms = function() {

};


/**
 * A value that indicates an orientation of clockwise, or a right turn.
 */
jsts.algorithm.CGAlgorithms.CLOCKWISE = -1;


/**
 * A value that indicates an orientation of clockwise, or a right turn.
 */
jsts.algorithm.CGAlgorithms.RIGHT = jsts.algorithm.CGAlgorithms.CLOCKWISE;


/**
 * A value that indicates an orientation of counterclockwise, or a left turn.
 */
jsts.algorithm.CGAlgorithms.COUNTERCLOCKWISE = 1;


/**
 * A value that indicates an orientation of counterclockwise, or a left turn.
 */
jsts.algorithm.CGAlgorithms.LEFT =
    jsts.algorithm.CGAlgorithms.COUNTERCLOCKWISE;


/**
 * A value that indicates an orientation of collinear, or no turn (straight).
 */
jsts.algorithm.CGAlgorithms.COLLINEAR = 0;


/**
 * A value that indicates an orientation of collinear, or no turn (straight).
 */
jsts.algorithm.CGAlgorithms.STRAIGHT = jsts.algorithm.CGAlgorithms.COLLINEAR;


/**
 * Returns the index of the direction of the point <code>q</code>
 * relative to a
 * vector specified by <code>p1-p2</code>.
 *
 * @param {jsts.geom.Coordinate}
 *        p1 the origin point of the vector.
 * @param {jsts.geom.Coordinate}
 *        p2 the final point of the vector.
 * @param {jsts.geom.Coordinate}
 *        q the point to compute the direction to.
 *
 * @return {Number}
 *         1 if q is counter-clockwise (left) from p1-p2.
 * @return {Number}
 *         -1 if q is clockwise (right) from p1-p2.
 * @return {Number}
 *         0 if q is collinear with p1-p2.
 */
jsts.algorithm.CGAlgorithms.orientationIndex = function(p1, p2, q) {
  /**
   * MD - 9 Aug 2010
   * It seems that the basic algorithm is slightly orientation dependent,
   * when computing the orientation of a point very close to a line.
   * This is possibly due to the arithmetic in the translation to the origin.
   *
   * For instance, the following situation produces identical results
   * in spite of the inverse orientation of the line segment:
   *
   * Coordinate p0 = new Coordinate(219.3649559090992, 140.84159161824724);
   * Coordinate p1 = new Coordinate(168.9018919682399, -5.713787599646864);
   *
   * Coordinate p = new Coordinate(186.80814046338352, 46.28973405831556);
   * int orient = orientationIndex(p0, p1, p);
   * int orientInv = orientationIndex(p1, p0, p);

   * A way to force consistent results is to normalize the orientation of
   * the vector using the following code.
   * However, this may make the results of orientationIndex inconsistent
   * through the triangle of points, so it's not clear this is
   * an appropriate patch.
   *
   */

  var dx1, dy1, dx2, dy2;
  dx1 = p2.x - p1.x;
  dy1 = p2.y - p1.y;
  dx2 = q.x - p2.x;
  dy2 = q.y - p2.y;

  return jsts.algorithm.RobustDeterminant.signOfDet2x2(dx1, dy1, dx2, dy2);
};


/**
 * Tests whether a point lies inside or on a ring.
 * The ring may be oriented in either direction.
 * A point lying exactly on the ring boundary is
 * considered to be inside the ring.
 * <p>
 * This method does <i>not</i> first check the point against the envelope
 * of the ring.
 *
 * @param {jsts.geom.Coordinate}
 *        p point to check for ring inclusion.
 * @param {Array{jsts.geom.Coordinate}}
 *        ring an array of coordinates representing the ring
 *        (which must have first point identical to last point)
 * @return {Boolean}
 *         true if p is inside ring.
 *
 * @see locatePointInRing
 */
jsts.algorithm.CGAlgorithms.isPointInRing = function(p, ring) {
  return jsts.algorithm.CGAlgorithms.locatePointInRing(p, ring) !==
      jsts.geom.Location.EXTERIOR;
};


/**
 * Determines whether a point lies in the interior, on the boundary,
 * or in the exterior of a ring.
 * The ring may be oriented in either direction.
 * <p>
 * This method does <i>not</i> first check the point against the envelope
 * of the ring.
 *
 * @param {jsts.geom.Coordinate}
 *        p point to check for ring inclusion.
 * @param {Array{jsts.geom.Coordinate}}
 *        ring an array of coordinates representing the ring
 *        (which must have first point identical to last point)
 * @return {jsts.geom.Location}
 *         the {@link Location} of p relative to the ring.
 */
jsts.algorithm.CGAlgorithms.locatePointInRing = function(p, ring) {
  return jsts.algorithm.RayCrossingCounter.locatePointInRing(p, ring);
};


/**
 * Tests whether a point lies on the line segments defined by a
 * list of coordinates.
 *
 * @param  {jsts.geom.Coordinate}
 *         p the coordinate to test.
 * @param  {Array{jsts.geom.Coordinate}}
 *         pt An array of coordinates defining line segments
 * @return {Boolean}
 *         true if the point is a vertex of the line
 *         or lies in the interior of a line segment in the linestring.
 */
jsts.algorithm.CGAlgorithms.isOnLine = function(p, pt) {
  var lineIntersector, i, il, p0, p1;
  lineIntersector = new jsts.algorithm.RobustLineIntersector();

  for (i = 1, il = pt.length; i < il; i++) {
    p0 = pt[i - 1];
    p1 = pt[i];
    lineIntersector.computeIntersection(p, p0, p1);

    if (lineIntersector.hasIntersection()) {
      return true;
    }
  }
  return false;
};


/**
 * Computes whether a ring defined by an array of {@link Coordinate}s is
 * oriented counter-clockwise.
 * <ul>
 * <li>The list of points is assumed to have the first and last points equal.
 * <li>This will handle coordinate lists which contain repeated points.
 * </ul>
 * This algorithm is <b>only</b> guaranteed to work with valid rings.
 * If the ring is invalid (e.g. self-crosses or touches),
 * the computed result may not be correct.
 *
 * @param {Array{jsts.geom.Coordinate}}
 *        ring an array of Coordinates forming a ring
 * @return {Boolean}
 *         true if the ring is oriented counter-clockwise.
 * @throws IllegalArgumentException if there are too few points to determine orientation (< 3)
 */
jsts.algorithm.CGAlgorithms.isCCW = function(ring) {
  var nPts, hiPt, hiIndex, p, iPrev, iNext, prev, next, i, disc, isCCW;

  //# of points without closing endpoint
  nPts = ring.length - 1;

  //sanity check
  if (nPts < 3) {
    throw new jsts.IllegalArgumentError('Ring has fewer than 3 points, so orientation cannot be determined');
  }

  //find highets point
  hiPt = ring[0];
  hiIndex = 0;

  i = 1;
  for (i; i <= nPts; i++) {
    p = ring[i];
    if (p.y > hiPt.y) {
      hiPt = p;
      hiIndex = i;
    }
  }

  //find distinct point before highest point
  iPrev = hiIndex;
  do {
    iPrev = iPrev - 1;
    if (iPrev < 0) {
      iPrev = nPts;
    }
  }while (ring[iPrev].equals2D(hiPt) && iPrev !== hiIndex);

  //find distinct point after highest point
  iNext = hiIndex;
  do {
    iNext = (iNext + 1) % nPts;
  }while (ring[iNext].equals2D(hiPt) && iNext !== hiIndex);

  prev = ring[iPrev];
  next = ring[iNext];

  /**
   * This check catches cases where the ring contains an A-B-A configuration of points.
   * This can happen if the ring does not contain 3 distinct points
   * (including the case where the input array has fewer than 4 elements),
   * or it contains coincident line segments.
   */
  if (prev.equals2D(hiPt) || next.equals2D(hiPt) || prev.equals2D(next)) {
    return false;
  }

  disc = jsts.algorithm.CGAlgorithms.computeOrientation(prev, hiPt, next);

  /**
   *  If disc is exactly 0, lines are collinear.  There are two possible cases:
   *  (1) the lines lie along the x axis in opposite directions
   *  (2) the lines lie on top of one another
   *
   *  (1) is handled by checking if next is left of prev ==> CCW
   *  (2) will never happen if the ring is valid, so don't check for it
   *  (Might want to assert this)
   */
  isCCW = false;
  if (disc === 0) {
    // poly is CCW if prev x is right of next x
    isCCW = (prev.x > next.x);
  }
  else {
    // if area is positive, points are ordered CCW
    isCCW = (disc > 0);
  }

  return isCCW;
};


/**
 * Computes the orientation of a point q to the directed line segment p1-p2.
 * The orientation of a point relative to a directed line segment indicates
 * which way you turn to get to q after travelling from p1 to p2.
 *
 * @param {jsts.geom.Coordinate}
 *        p1 First coordinate of the linesegment.
 * @param {jsts.geom.Coordinate}
 *        p2 Second coordinate of the linesegment.
 * @param {jsts.geom.Coordinate}
 *        q The point to calculate orientation of.
 *
 * @return {Number}
 *         1 if q is counter-clockwise from p1-p2.
 * @return {Number}
 *         -1 if q is clockwise from p1-p2.
 * @return {Number}
 *         0 if q is collinear with p1-p2.
 */
jsts.algorithm.CGAlgorithms.computeOrientation = function(p1, p2, q) {
  return jsts.algorithm.CGAlgorithms.orientationIndex(p1, p2, q);
};


/**
 * Computes the distance from a point p to a line segment AB
 *
 * Note: NON-ROBUST!
 *
 * @param {jsts.geom.Coordinate}
 *        p the point to compute the distance for.
 * @param {jsts.geom.Coordinate}
 *        A one point of the line.
 * @param {jsts.geom.Coordinate}
 *        B another point of the line (must be different to A).
 * @return {Number}
 *         the distance from p to line segment AB.
 */
jsts.algorithm.CGAlgorithms.distancePointLine = function(p, A, B) {
  if (!(A instanceof jsts.geom.Coordinate)) {
    jsts.algorithm.CGAlgorithms.distancePointLine2.apply(this, arguments);
  }

  //if start = end, then just compute distance to one of the endpoints
  if (A.x === B.x && A.y === B.y) {
    return p.distance(A);
  }
  //otherwise use comp.graphics.algorithms Frequently Asked Questions method
  /*(1)             AC dot AB
                   r = ---------
                         ||AB||^2
    r has the following meaning:
    r=0 P = A
    r=1 P = B
    r<0 P is on the backward extension of AB
    r>1 P is on the forward extension of AB
    0<r<1 P is interior to AB
  */
  var r, s;
  r = ((p.x - A.x) * (B.x - A.x) + (p.y - A.y) * (B.y - A.y)) /
      ((B.x - A.x) * (B.x - A.x) + (B.y - A.y) * (B.y - A.y));

  if (r <= 0.0) {
    return p.distance(A);
  }
  if (r >= 1.0) {
    return p.distance(B);
  }

  /*(2)
    (Ay-Cy)(Bx-Ax)-(Ax-Cx)(By-Ay)
  s = -----------------------------
             L^2

  Then the distance from C to P = |s|*L.
  */

  s = ((A.y - p.y) * (B.x - A.x) - (A.x - p.x) * (B.y - A.y)) /
      ((B.x - A.x) * (B.x - A.x) + (B.y - A.y) * (B.y - A.y));

  return Math.abs(s) *
      Math.sqrt(((B.x - A.x) * (B.x - A.x) + (B.y - A.y) * (B.y - A.y)));
};


/**
 * Computes the perpendicular distance from a point p
 * to the (infinite) line containing the points AB
 *
 * @param {jsts.geom.Coordinate}
 *        p the point to compute the distance for.
 * @param {jsts.geom.Coordinate}
 *        A one point of the line.
 * @param {jsts.geom.Coordinate}
 *        B another point of the line (must be different to A).
 * @return {Number}
 *         the distance from p to line AB.
 */
jsts.algorithm.CGAlgorithms.distancePointLinePerpendicular = function(p, A, B) {
  //use comp.graphics.algorithms Frequently Asked Questions method
  /*(2)
                   (Ay-Cy)(Bx-Ax)-(Ax-Cx)(By-Ay)
              s = -----------------------------
                                   L^2

              Then the distance from C to P = |s|*L.
  */
  var s = ((A.y - p.y) * (B.x - A.x) - (A.x - p.x) * (B.y - A.y)) /
      ((B.x - A.x) * (B.x - A.x) + (B.y - A.y) * (B.y - A.y));

  return Math.abs(s) *
      Math.sqrt(((B.x - A.x) * (B.x - A.x) + (B.y - A.y) * (B.y - A.y)));
};


/**
 * Computes the distance from a point to a sequence
 * of line segments.
 *
 * @param {jsts.geom.Coordinate}
 *        p a point.
 * @param {Array{jsts.geom.Coordinate}}
 *        line a sequence of contiguous line segments defined by their vertices
 * @return {Number}
 *         the minimum distance between the point and the line segments.
 */
jsts.algorithm.CGAlgorithms.distancePointLine2 = function(p, line) {
  var minDistance, i, il, dist;
  if (line.length === 0) {
    throw new jsts.error.IllegalArgumentError('Line array must contain at least one vertex');
  }
  minDistance = p.distance(line[0]);
  for (i = 0, il = line.length - 1; i < il; i++) {
    dist = jsts.algorithm.CGAlgorithms.distancePointLine(p, line[i], line[i + 1]);
    if (dist < minDistance) {
      minDistance = dist;
    }
  }
  return minDistance;
};

/**
 * Computes the distance from a line segment AB to a line segment CD
 *
 * Note: NON-ROBUST!
 *
 * @param {jsts.geom.Coordinate}
 *        A a point of one line.
 * @param {jsts.geom.Coordinate}
 *        B the second point of  (must be different to A).
 * @param {jsts.geom.Coordinate}
 *        C one point of the line.
 * @param {jsts.geom.Coordinate}
 *        D another point of the line (must be different to A).
 * @return {Number}
 *         the distance.
 */

jsts.algorithm.CGAlgorithms.distanceLineLine = function(A, B, C, D) {
  //check for zero-length segments
  if (A.equals(B)) {
    return jsts.algorithm.CGAlgorithms.distancePointLine(A, C, D);
  }
  if (C.equals(D)) {
    return jsts.algorithm.CGAlgorithms.distancePointLine(D, A, B);
  }

  //AB and CD are line segments
  /* from comp.graphics.algo

  Solving the above for r and s yields
        (Ay-Cy)(Dx-Cx)-(Ax-Cx)(Dy-Cy)
             r = ----------------------------- (eqn 1)
        (Bx-Ax)(Dy-Cy)-(By-Ay)(Dx-Cx)

      (Ay-Cy)(Bx-Ax)-(Ax-Cx)(By-Ay)
    s = ----------------------------- (eqn 2)
      (Bx-Ax)(Dy-Cy)-(By-Ay)(Dx-Cx)
  Let P be the position vector of the intersection point, then
    P=A+r(B-A) or
    Px=Ax+r(Bx-Ax)
    Py=Ay+r(By-Ay)
  By examining the values of r & s, you can also determine some other
  limiting conditions:
    If 0<=r<=1 & 0<=s<=1, intersection exists
    r<0 or r>1 or s<0 or s>1 line segments do not intersect
    If the denominator in eqn 1 is zero, AB & CD are parallel
    If the numerator in eqn 1 is also zero, AB & CD are collinear.

  */
  var r_top, r_bot, s_top, s_bot, s, r;
  r_top = (A.y - C.y) * (D.x - C.x) - (A.x - C.x) * (D.y - C.y);
  r_bot = (B.x - A.x) * (D.y - C.y) - (B.y - A.y) * (D.x - C.x);

  s_top = (A.y - C.y) * (B.x - A.x) - (A.x - C.x) * (B.y - A.y);
  s_bot = (B.x - A.x) * (D.y - C.y) - (B.y - A.y) * (D.x - C.x);


  if ((r_bot === 0) || (s_bot === 0)) {
    return Math.min(jsts.algorithm.CGAlgorithms.distancePointLine(A, C, D),
        Math.min(jsts.algorithm.CGAlgorithms.distancePointLine(B, C, D),
            Math.min(jsts.algorithm.CGAlgorithms.distancePointLine(C, A, B),
                jsts.algorithm.CGAlgorithms.distancePointLine(D, A, B))));
  }

  s = s_top / s_bot;
  r = r_top / r_bot;
  if ((r < 0) || (r > 1) || (s < 0) || (s > 1)) {
    //no intersection
    return Math.min(jsts.algorithm.CGAlgorithms.distancePointLine(A, C, D),
        Math.min(jsts.algorithm.CGAlgorithms.distancePointLine(B, C, D),
        Math.min(jsts.algorithm.CGAlgorithms.distancePointLine(C, A, B),
            jsts.algorithm.CGAlgorithms.distancePointLine(D, A, B))));
  }

  return 0.0; //intersection exists
};


/**
 * Computes the signed area for a ring.
 * The signed area is positive if
 * the ring is oriented CW, negative if the ring is oriented CCW,
 * and zero if the ring is degenerate or flat.
 *
 * @param {Array{jsts.geom.Coordinate}}
 *        ring the coordinates forming the ring
 * @return {Number}
 *         the signed area of the ring.
 */
jsts.algorithm.CGAlgorithms.signedArea = function(ring) {
  if (ring.length < 3) {
    return 0.0;
  }
  var sum, i, il, bx, by, cx, cy;

  sum = 0.0;

  for (i = 0, il = ring.length - 1; i < il; i++) {
    bx = ring[i].x;
    by = ring[i].y;
    cx = ring[i + 1].x;
    cy = ring[i + 1].y;
    sum += (bx + cx) * (cy - by);
  }

  return -sum / 2.0;
};


/**
 * Computes the signed area for a ring.
 * The signed area is:
 * <ul>
 * <li>positive if the ring is oriented CW
 * <li>negative if the ring is oriented CCW
 * <li>zero if the ring is degenerate or flat
 * </ul>
 *
 * @param {Array{jsts.geom.Coordinate}}
 *        ring the coordinates forming the ring
 * @return {Number}
 *         the signed area of the ring.
 */
jsts.algorithm.CGAlgorithms.signedArea = function(ring) {
  var n, sum, p, bx, by, i, cx, cy;

  n = ring.length;
  if (n < 3) {
    return 0.0;
  }

  sum = 0.0;
  p = ring[0];

  bx = p.x;
  by = p.y;

  for (i = 1; i < n; i++) {
    p = ring[i];
    cx = p.x;
    cy = p.y;
    sum += (bx + cx) * (cy - by);
    bx = cx;
    by = cy;
  }

  return -sum / 2.0;
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Represents a homogeneous coordinate in a 2-D coordinate space. In JTS
 * {@link HCoordinate}s are used as a clean way of computing intersections
 * between line segments.
 *
 * Initializes a new HCoordinate using the OpenLayers inheritance mechanism.
 * Will call correct init* function depending on argument.
 *
 * @constructor
 */
jsts.algorithm.HCoordinate = function() {
  this.x = 0.0;
  this.y = 0.0;
  this.w = 1.0;

  if (arguments.length === 1) {
    this.initFrom1Coordinate(arguments[0]);
  } else if (arguments.length === 2 &&
      arguments[0] instanceof jsts.geom.Coordinate) {
    this.initFrom2Coordinates(arguments[0], arguments[1]);
  } else if (arguments.length === 2 &&
      arguments[0] instanceof jsts.algorithm.HCoordinate) {
    this.initFrom2HCoordinates(arguments[0], arguments[1]);
  } else if (arguments.length === 2) {
    this.initFromXY(arguments[0], arguments[1]);
  } else if (arguments.length === 3) {
    this.initFromXYW(arguments[0], arguments[1], arguments[2]);
  } else if (arguments.length === 4) {
    this.initFromXYW(arguments[0], arguments[1], arguments[2], arguments[3]);
  }
};


/**
 * Computes the (approximate) intersection point between two line segments using
 * homogeneous coordinates.
 * <p>
 * Note that this algorithm is not numerically stable; i.e. it can produce
 * intersection points which lie outside the envelope of the line segments
 * themselves. In order to increase the precision of the calculation input
 * points should be normalized before passing them to this routine.
 *
 * @param {jsts.geom.Coordinate}
 *          p1 first coordinate for the first line.
 * @param {jsts.geom.Coordinate}
 *          p2 second coordinate for the first line.
 * @param {jsts.geom.Coordinate}
 *          q1 first coordinate for the second line.
 * @param {jsts.geom.Coordinate}
 *          q2 second coordinate for the second line.
 * @return {jsts.geom.Coordinate} The coordinate of the intersection.
 */
jsts.algorithm.HCoordinate.intersection = function(p1, p2, q1, q2) {
  var px, py, pw, qx, qy, qw, x, y, w, xInt, yInt;

  // unrolled computation
  px = p1.y - p2.y;
  py = p2.x - p1.x;
  pw = p1.x * p2.y - p2.x * p1.y;

  qx = q1.y - q2.y;
  qy = q2.x - q1.x;
  qw = q1.x * q2.y - q2.x * q1.y;

  x = py * qw - qy * pw;
  y = qx * pw - px * qw;
  w = px * qy - qx * py;

  xInt = x / w;
  yInt = y / w;

  if (!isFinite(xInt) || !isFinite(yInt)) {
    throw new jsts.error.NotRepresentableError();
  }

  return new jsts.geom.Coordinate(xInt, yInt);
};


/**
 * Initializes a new HCoordinate from 1 Coordinate
 *
 * @param {jsts.geom.Coordinate}
 *          p the coordinate.
 */
jsts.algorithm.HCoordinate.prototype.initFrom1Coordinate = function(p) {
  this.x = p.x;
  this.y = p.y;
  this.w = 1.0;
};


/**
 * Constructs a homogeneous coordinate which is the intersection of the lines
 * define by the homogenous coordinates represented by two {@link Coordinate}s.
 *
 * @param {jsts.geom.Coordinate}
 *          p1 the first coordinate.
 * @param {jsts.geom.Coordinate}
 *          p2 the second coordinate.
 */
jsts.algorithm.HCoordinate.prototype.initFrom2Coordinates = function(p1, p2) {
  // optimization when it is known that w = 1
  this.x = p1.y - p2.y;
  this.y = p2.x - p1.x;
  this.w = p1.x * p2.y - p2.x * p1.y;
};


/**
 * Initializes from 2 HCoordinates
 *
 * @param {jsts.algorithm.HCoordinate}
 *          p1 the first HCoordinate.
 * @param {jsts.algorithm.HCoordinate}
 *          p2 the second HCoordinate.
 */
jsts.algorithm.HCoordinate.prototype.initFrom2HCoordinates = function(p1, p2) {
  this.x = p1.y * p2.w - p2.y * p1.w;
  this.y = p2.x * p1.w - p1.x * p2.w;
  this.w = p1.x * p2.y - p2.x * p1.y;
};


/**
 * Initializes from x,y,w
 *
 * @param {Number}
 *          x the x-value.
 * @param {Number}
 *          y the y-value.
 * @param {Number}
 *          w the w-value.
 */
jsts.algorithm.HCoordinate.prototype.initFromXYW = function(x, y, w) {
  this.x = x;
  this.y = y;
  this.w = w;
};


/**
 * Initializes from x,y
 *
 * @param {Number}
 *          x the x-value.
 * @param {Number}
 *          y the y-value.
 */
jsts.algorithm.HCoordinate.prototype.initFromXY = function(x, y) {
  this.x = x;
  this.y = y;
  this.w = 1.0;
};


/**
 * Initializes from 4 Coordinates
 *
 * @param {jsts.geom.Coordinate}
 *          p1 the first coordinate.
 * @param {jsts.geom.Coordinate}
 *          p2 the second coordinate.
 * @param {jsts.geom.Coordinate}
 *          q1 the first coordinate.
 * @param {jsts.geom.Coordinate}
 *          q2 the second coordinate.
 */
jsts.algorithm.HCoordinate.prototype.initFrom4Coordinates = function(p1, p2,
    q1, q2) {
  var px, py, pw, qx, qy, qw;
  // unrolled computation
  px = p1.y - p2.y;
  py = p2.x - p1.x;
  pw = p1.x * p2.y - p2.x * p1.y;

  qx = q1.y - q2.y;
  qy = q2.x - q1.x;
  qw = q1.x * q2.y - q2.x * q1.y;

  this.x = py * qw - qy * pw;
  this.y = qx * pw - px * qw;
  this.w = px * qy - qx * py;
};


/**
 * Gets x/w
 *
 * @return {Number} x/w.
 */
jsts.algorithm.HCoordinate.prototype.getX = function() {
  var a = this.x / this.w;

  if (!isFinite(a)) {
    throw new jsts.error.NotRepresentableError();
  }
  return a;
};


/**
 * Gets y/w
 *
 * @return {Number} y/w.
 */
jsts.algorithm.HCoordinate.prototype.getY = function() {
  var a = this.y / this.w;

  if (!isFinite(a)) {
    throw new jsts.error.NotRepresentableError();
  }
  return a;
};


/**
 * Gets a coordinate represented by this HCoordinate
 *
 * @return {jst.geom.Coordinate} The coordinate.
 */
jsts.algorithm.HCoordinate.prototype.getCoordinate = function() {
  var p = new jsts.geom.Coordinate();
  p.x = this.getX();
  p.y = this.getY();
  return p;
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * A LineIntersector is an algorithm that can both test whether two line
 * segments intersect and compute the intersection point if they do. The
 * intersection point may be computed in a precise or non-precise manner.
 * Computing it precisely involves rounding it to an integer. (This assumes that
 * the input coordinates have been made precise by scaling them to an integer
 * grid.)
 *
 * @constructor
 */
jsts.algorithm.LineIntersector = function() {
  this.inputLines = [[], []];
  this.intPt = [];

  this.intPt[0] = new jsts.geom.Coordinate();
  this.intPt[1] = new jsts.geom.Coordinate();
  // alias the intersection points for ease of reference
  this.pa = this.intPt[0];
  this.pb = this.intPt[1];
  this.result = jsts.algorithm.LineIntersector.NO_INTERSECTION;
};


/**
 * Indicates that line segments do not intersect
 *
 * @type {int}
 */
jsts.algorithm.LineIntersector.NO_INTERSECTION = 0;


/**
 * Indicates that line segments intersect in a single point
 *
 * @type {int}
 */
jsts.algorithm.LineIntersector.POINT_INTERSECTION = 1;


/**
 * Indicates that line segments intersect in a line segment
 *
 * @type {int}
 */
jsts.algorithm.LineIntersector.COLLINEAR_INTERSECTION = 2;


/**
 * Force computed intersection to be rounded to a given precision model. No
 * getter is provided, because the precision model is not required to be
 * specified.
 *
 * @param precisionModel
 */
jsts.algorithm.LineIntersector.prototype.setPrecisionModel = function(
    precisionModel) {
  this.precisionModel = precisionModel;
};


/**
 * Gets an endpoint of an input segment.
 *
 * @param segmentIndex
 *          the index of the input segment (0 or 1).
 * @param ptIndex
 *          the index of the endpoint (0 or 1).
 * @return the specified endpoint.
 */
jsts.algorithm.LineIntersector.prototype.getEndpoint = function(segmentIndex,
    ptIndex) {
  return this.inputLines[segmentIndex][ptIndex];
};


/**
 * Computes the "edge distance" of an intersection point p along a segment. The
 * edge distance is a metric of the point along the edge. The metric used is a
 * robust and easy to compute metric function. It is <b>not</b> equivalent to
 * the usual Euclidean metric. It relies on the fact that either the x or the y
 * ordinates of the points in the edge are unique, depending on whether the edge
 * is longer in the horizontal or vertical direction.
 * <p>
 * NOTE: This function may produce incorrect distances for inputs where p is not
 * precisely on p1-p2 (E.g. p = (139,9) p1 = (139,10), p2 = (280,1) produces
 * distanct 0.0, which is incorrect.
 * <p>
 * My hypothesis is that the function is safe to use for points which are the
 * result of <b>rounding</b> points which lie on the line, but not safe to use
 * for <b>truncated</b> points.
 *
 * @param {Coordinate}
 *          p
 * @param {Coordinate}
 *          p0
 * @param {Coordinate}
 *          p1
 * @return {double}
 */
jsts.algorithm.LineIntersector.computeEdgeDistance = function(p, p0, p1) {
  var dx = Math.abs(p1.x - p0.x);
  var dy = Math.abs(p1.y - p0.y);

  var dist = -1.0; // sentinel value
  if (p.equals(p0)) {
    dist = 0.0;
  } else if (p.equals(p1)) {
    if (dx > dy) {
      dist = dx;
    } else {
      dist = dy;
    }
  } else {
    var pdx = Math.abs(p.x - p0.x);
    var pdy = Math.abs(p.y - p0.y);
    if (dx > dy) {
      dist = pdx;
    } else {
      dist = pdy;
    }
    // <FIX>
    // hack to ensure that non-endpoints always have a non-zero distance
    if (dist === 0.0 && !p.equals(p0)) {
      dist = Math.max(pdx, pdy);
    }
  }
  if (dist === 0.0 && !p.equals(p0)) {
    throw new jsts.error.IllegalArgumentError('Bad distance calculation');
  }
  return dist;
};


/**
 * This function is non-robust, since it may compute the square of large
 * numbers. Currently not sure how to improve this.
 *
 * @param {Coordinate}
 *          p
 * @param {Coordinate}
 *          p0
 * @param {Coordinate}
 *          p1
 * @return {double}
 */
jsts.algorithm.LineIntersector.nonRobustComputeEdgeDistance = function(p, p1,
    p2) {
  var dx = p.x - p1.x;
  var dy = p.y - p1.y;
  var dist = Math.sqrt(dx * dx + dy * dy); // dummy value
  if (!(dist === 0.0 && !p.equals(p1))) {
    throw new jsts.error.IllegalArgumentError('Invalid distance calculation');
  }
  return dist;
};


/**
 * @protected
 * @type {int}
 */
jsts.algorithm.LineIntersector.prototype.result = null;


/**
 * @protected
 * @type {Coordinate[][] }
 */
jsts.algorithm.LineIntersector.prototype.inputLines = null;


/**
 * @protected
 * @type {Coordinate[]}
 */
jsts.algorithm.LineIntersector.prototype.intPt = null;


/**
 * The indexes of the endpoints of the intersection lines, in order along the
 * corresponding line
 */
/**
 * @protected
 * @type {int[][]}
 */
jsts.algorithm.LineIntersector.prototype.intLineIndex = null;


/**
 * @protected
 * @type {boolean}
 */
jsts.algorithm.LineIntersector.prototype._isProper = null;


/**
 * @protected
 * @type {Coordinate}
 */
jsts.algorithm.LineIntersector.prototype.pa = null;


/**
 * @protected
 * @type {Coordinate}
 */
jsts.algorithm.LineIntersector.prototype.pb = null;


/**
 * @protected
 * @type {PrecisionModel}
 */
jsts.algorithm.LineIntersector.prototype.precisionModel = null;


/**
 * Compute the intersection of a point p and the line p1-p2. This function
 * computes the boolean value of the hasIntersection test. The actual value of
 * the intersection (if there is one) is equal to the value of <code>p</code>.
 *
 * @param {Coordinate}
 *          p
 * @param {Coordinate}
 *          p1
 * @param {Coordinate}
 *          p2
 */
jsts.algorithm.LineIntersector.prototype.computeIntersection = function(p, p1,
    p2) {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * @return {boolean}
 * @protected
 */
jsts.algorithm.LineIntersector.prototype.isCollinear = function() {
  return this.result === jsts.algorithm.LineIntersector.COLLINEAR_INTERSECTION;
};


/**
 * Computes the intersection of the lines p1-p2 and p3-p4. This function
 * computes both the boolean value of the hasIntersection test and the
 * (approximate) value of the intersection point itself (if there is one).
 *
 * @param {Coordinate}
 *          p1
 * @param {Coordinate}
 *          p2
 * @param {Coordinate}
 *          p3
 * @param {Coordinate}
 *          p4
 */
jsts.algorithm.LineIntersector.prototype.computeIntersection = function(p1, p2,
    p3, p4) {
  this.inputLines[0][0] = p1;
  this.inputLines[0][1] = p2;
  this.inputLines[1][0] = p3;
  this.inputLines[1][1] = p4;
  this.result = this.computeIntersect(p1, p2, p3, p4);
};


/**
 * @param {Coordinate}
 *          p1
 * @param {Coordinate}
 *          p2
 * @param {Coordinate}
 *          q1
 * @param {Coordinate}
 *          q2
 * @return {int}
 * @protected
 */
jsts.algorithm.LineIntersector.prototype.computeIntersect = function(p1, p2,
    q1, q2) {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * @return {boolean}
 * @protected
 */
jsts.algorithm.LineIntersector.prototype.isEndPoint = function() {
  return this.hasIntersection() && !this._isProper;
};


/**
 * Tests whether the input geometries intersect.
 *
 * @return {boolean} true if the input geometries intersect.
 */
jsts.algorithm.LineIntersector.prototype.hasIntersection = function() {
  return this.result !== jsts.algorithm.LineIntersector.NO_INTERSECTION;
};


/**
 * Returns the number of intersection points found. This will be either 0, 1 or
 * 2.
 *
 * @return {int}
 */
jsts.algorithm.LineIntersector.prototype.getIntersectionNum = function() {
  return this.result;
};


/**
 * Returns the intIndex'th intersection point
 *
 * @param {int}
 *          intIndex is 0 or 1.
 *
 * @return {Coordinate} the intIndex'th intersection point.
 */
jsts.algorithm.LineIntersector.prototype.getIntersection = function(intIndex) {
  return this.intPt[intIndex];
};


/**
 * @protected
 */
jsts.algorithm.LineIntersector.prototype.computeIntLineIndex = function() {
  if (this.intLineIndex === null) {
    this.intLineIndex = [[], []];
    this.computeIntLineIndex(0);
    this.computeIntLineIndex(1);
  }
};


/**
 * Test whether a point is a intersection point of two line segments. Note that
 * if the intersection is a line segment, this method only tests for equality
 * with the endpoints of the intersection segment. It does <b>not</b> return
 * true if the input point is internal to the intersection segment.
 *
 * @param {Coordinate}
 *          pt
 * @return {boolean} true if the input point is one of the intersection points.
 */
jsts.algorithm.LineIntersector.prototype.isIntersection = function(pt) {
  var i;
  for (i = 0; i < this.result; i++) {
    if (this.intPt[i].equals2D(pt)) {
      return true;
    }
  }
  return false;
};


/**
 * Tests whether either intersection point is an interior point of one of the
 * input segments.
 *
 * @return {boolean} <code>true</code> if either intersection point is in the
 *         interior of one of the input segments.
 */
jsts.algorithm.LineIntersector.prototype.isInteriorIntersection = function() {
  if (this.isInteriorIntersection(0)) {
    return true;
  }
  if (this.isInteriorIntersection(1)) {
    return true;
  }
  return false;
};


/**
 * Tests whether either intersection point is an interior point of the specified
 * input segment.
 *
 * @param {[]} inputLineIndex
 * @return {boolean} <code>true</code> if either intersection point is in the
 *         interior of the input segment.
 */
jsts.algorithm.LineIntersector.prototype.isInteriorIntersection = function(
    inputLineIndex) {
  var i;
  for (i = 0; i < this.result; i++) {
    if (!(this.intPt[i].equals2D(this.inputLines[inputLineIndex][0]) || this.intPt[i]
        .equals2D(this.inputLines[inputLineIndex][1]))) {
      return true;
    }
  }
  return false;
};


/**
 * Tests whether an intersection is proper. <br>
 * The intersection between two line segments is considered proper if they
 * intersect in a single point in the interior of both segments (e.g. the
 * intersection is a single point and is not equal to any of the endpoints).
 * <p>
 * The intersection between a point and a line segment is considered proper if
 * the point lies in the interior of the segment (e.g. is not equal to either of
 * the endpoints).
 *
 * @return {boolean} true if the intersection is proper.
 */
jsts.algorithm.LineIntersector.prototype.isProper = function() {
  return this.hasIntersection() && this._isProper;
};


/**
 * Computes the intIndex'th intersection point in the direction of a specified
 * input line segment
 *
 * @param {int}
 *          segmentIndex is 0 or 1.
 * @param {int}
 *          intIndex is 0 or 1.
 *
 * @return {Coordinate} the intIndex'th intersection point in the direction of
 *         the specified input line segment.
 */
jsts.algorithm.LineIntersector.prototype.getIntersectionAlongSegment = function(
    segmentIndex, intIndex) {
  // lazily compute int line array
  this.computeIntLineIndex();
  return this.intPt[intLineIndex[segmentIndex][intIndex]];
};


/**
 * Computes the index of the intIndex'th intersection point in the direction of
 * a specified input line segment
 *
 * @param {int}
 *          segmentIndex is 0 or 1.
 * @param {int}
 *          intIndex is 0 or 1.
 *
 * @return {int} the index of the intersection point along the segment (0 or 1).
 */
jsts.algorithm.LineIntersector.prototype.getIndexAlongSegment = function(
    segmentIndex, intIndex) {
  this.computeIntLineIndex();
  return this.intLineIndex[segmentIndex][intIndex];
};


/**
 * @param {int}
 *          segmentIndex
 * @protected
 */
jsts.algorithm.LineIntersector.prototype.computeIntLineIndex = function(
    segmentIndex) {
  var dist0 = this.getEdgeDistance(segmentIndex, 0);
  var dist1 = this.getEdgeDistance(segmentIndex, 1);
  if (dist0 > dist1) {
    this.intLineIndex[segmentIndex][0] = 0;
    this.intLineIndex[segmentIndex][1] = 1;
  } else {
    this.intLineIndex[segmentIndex][0] = 1;
    this.intLineIndex[segmentIndex][1] = 0;
  }
};


/**
 * Computes the "edge distance" of an intersection point along the specified
 * input line segment.
 *
 * @param {int}
 *          segmentIndex is 0 or 1.
 * @param {int}
 *          intIndex is 0 or 1.
 *
 * @return {double} the edge distance of the intersection point.
 */
jsts.algorithm.LineIntersector.prototype.getEdgeDistance = function(
    segmentIndex, intIndex) {
  var dist = jsts.algorithm.LineIntersector.computeEdgeDistance(
      this.intPt[intIndex], this.inputLines[segmentIndex][0],
      this.inputLines[segmentIndex][1]);
  return dist;
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Computes the topological ({@link Location}) of a single point to a
 * {@link Geometry}. A {@link BoundaryNodeRule} may be specified to control the
 * evaluation of whether the point lies on the boundary or not The default rule
 * is to use the the <i>SFS Boundary Determination Rule</i>
 * <p>
 * Notes:
 * <ul>
 * <li>{@link LinearRing}s do not enclose any area - points inside the ring
 * are still in the EXTERIOR of the ring.
 * </ul>
 * Instances of this class are not reentrant.
 *
 * @constructor
 */
jsts.algorithm.PointLocator = function(boundaryRule) {
  this.boundaryRule = boundaryRule ? boundaryRule
      : jsts.algorithm.BoundaryNodeRule.OGC_SFS_BOUNDARY_RULE;
};


/**
 * default is to use OGC SFS rule
 *
 * @type {BoundaryNodeRule}
 * @private
 */
jsts.algorithm.PointLocator.prototype.boundaryRule = null;


/**
 * true if the point lies in or on any Geometry element
 *
 * @type {boolean}
 * @private
 */
jsts.algorithm.PointLocator.prototype.isIn = null;


/**
 * the number of sub-elements whose boundaries the point lies in
 *
 * @type {int}
 * @private
 */
jsts.algorithm.PointLocator.prototype.numBoundaries = null;


/**
 * Convenience method to test a point for intersection with a Geometry
 *
 * @param {Coordinate}
 *          p the coordinate to test.
 * @param {Geometry}
 *          geom the Geometry to test.
 * @return {boolean} <code>true</code> if the point is in the interior or
 *         boundary of the Geometry.
 */
jsts.algorithm.PointLocator.prototype.intersects = function(p, geom) {
  return this.locate(p, geom) !== jsts.geom.Location.EXTERIOR;
};


/**
 * Computes the topological relationship ({@link Location}) of a single point
 * to a Geometry. It handles both single-element and multi-element Geometries.
 * The algorithm for multi-part Geometries takes into account the SFS Boundary
 * Determination Rule.
 *
 * @param {Coordinate}
 *          p the coordinate to test.
 * @param {Geometry}
 *          geom the Geometry to test.
 * @return {int} the {@link Location} of the point relative to the input
 *         Geometry.
 */
jsts.algorithm.PointLocator.prototype.locate = function(p, geom) {
  if (geom.isEmpty())
    return jsts.geom.Location.EXTERIOR;

  if (geom instanceof jsts.geom.Point) {
    return this.locate2(p, geom);
  } else if (geom instanceof jsts.geom.LineString) {
    return this.locate3(p, geom);
  } else if (geom instanceof jsts.geom.Polygon) {
    return this.locate4(p, geom);
  }

  this.isIn = false;
  this.numBoundaries = 0;
  this.computeLocation(p, geom);
  if (this.boundaryRule.isInBoundary(this.numBoundaries))
    return jsts.geom.Location.BOUNDARY;
  if (this.numBoundaries > 0 || this.isIn)
    return jsts.geom.Location.INTERIOR;

  return jsts.geom.Location.EXTERIOR;
};


/**
 * @param {Coordinate}
 *          p the coordinate to test.
 * @param {Geometry}
 *          geom the Geometry to test.
 * @private
 */
jsts.algorithm.PointLocator.prototype.computeLocation = function(p, geom) {
  if (geom instanceof jsts.geom.Point || geom instanceof jsts.geom.LineString ||
      geom instanceof jsts.geom.Polygon) {
    this.updateLocationInfo(this.locate(p, geom));
  } else if (geom instanceof jsts.geom.MultiLineString) {
    var ml = geom;
    for (var i = 0; i < ml.getNumGeometries(); i++) {
      var l = ml.getGeometryN(i);
      this.updateLocationInfo(this.locate(p, l));
    }
  } else if (geom instanceof jsts.geom.MultiPolygon) {
    var mpoly = geom;
    for (var i = 0; i < mpoly.getNumGeometries(); i++) {
      var poly = mpoly.getGeometryN(i);
      this.updateLocationInfo(this.locate(p, poly));
    }
  } else if (geom instanceof jsts.geom.GeometryCollection) {
    // TODO: port
    throw new jsts.error.NotImplementedError();
    var geomi = new GeometryCollectionIterator(geom);
    while (geomi.hasNext()) {
      var g2 = geomi.next();
      if (g2 != geom)
        this.computeLocation(p, g2);
    }
  }
};


/**
 * @param {int}
 *          loc
 * @return {int}
 * @private
 */
jsts.algorithm.PointLocator.prototype.updateLocationInfo = function(loc) {
  if (loc === jsts.geom.Location.INTERIOR)
    this.isIn = true;
  if (loc === jsts.geom.Location.BOUNDARY)
    this.numBoundaries++;
};


/**
 * @param {Coordinate}
 *          p the coordinate to test.
 * @param {Point}
 *          pt the Point to test.
 * @return {int}
 * @private
 */
jsts.algorithm.PointLocator.prototype.locate2 = function(p, pt) {
  // no point in doing envelope test, since equality test is just as fast

  var ptCoord = pt.getCoordinate();
  if (ptCoord.equals2D(p))
    return jsts.geom.Location.INTERIOR;
  return jsts.geom.Location.EXTERIOR;
};


/**
 * @param {Coordinate}
 *          p the coordinate to test.
 * @param {LineString}
 *          l the LineString to test.
 * @return {int}
 * @private
 */
jsts.algorithm.PointLocator.prototype.locate3 = function(p, l) {
  // bounding-box check
  if (!l.getEnvelopeInternal().intersects(p))
    return jsts.geom.Location.EXTERIOR;

  var pt = l.getCoordinates();
  if (!l.isClosed()) {
    if (p.equals(pt[0]) || p.equals(pt[pt.length - 1])) {
      return jsts.geom.Location.BOUNDARY;
    }
  }
  if (jsts.algorithm.CGAlgorithms.isOnLine(p, pt))
    return jsts.geom.Location.INTERIOR;
  return jsts.geom.Location.EXTERIOR;
};


/**
 * @param {Coordinate}
 *          p the coordinate to test.
 * @param {LinearRing}
 *          ring the LinearRing to test.
 * @return {int}
 * @private
 */
jsts.algorithm.PointLocator.prototype.locateInPolygonRing = function(p, ring) {
  // bounding-box check
  if (!ring.getEnvelopeInternal().intersects(p))
    return jsts.geom.Location.EXTERIOR;

  return jsts.algorithm.CGAlgorithms
      .locatePointInRing(p, ring.getCoordinates());
};


/**
 * @param {Coordinate}
 *          p the coordinate to test.
 * @param {Polygon}
 *          poly the LinearRing to test.
 * @return {int}
 * @private
 */
jsts.algorithm.PointLocator.prototype.locate4 = function(p, poly) {
  if (poly.isEmpty())
    return jsts.geom.Location.EXTERIOR;

  var shell = poly.getExteriorRing();

  var shellLoc = this.locateInPolygonRing(p, shell);
  if (shellLoc === jsts.geom.Location.EXTERIOR)
    return jsts.geom.Location.EXTERIOR;
  if (shellLoc === jsts.geom.Location.BOUNDARY)
    return jsts.geom.Location.BOUNDARY;
  // now test if the point lies in or on the holes
  for (var i = 0; i < poly.getNumInteriorRing(); i++) {
    var hole = poly.getInteriorRingN(i);
    var holeLoc = this.locateInPolygonRing(p, hole);
    if (holeLoc === jsts.geom.Location.INTERIOR)
      return jsts.geom.Location.EXTERIOR;
    if (holeLoc === jsts.geom.Location.BOUNDARY)
      return jsts.geom.Location.BOUNDARY;
  }
  return jsts.geom.Location.INTERIOR;
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Counts the number of segments crossed by a horizontal ray extending to the
 * right from a given point, in an incremental fashion. This can be used to
 * determine whether a point lies in a {@link Polygonal} geometry. The class
 * determines the situation where the point lies exactly on a segment. When
 * being used for Point-In-Polygon determination, this case allows
 * short-circuiting the evaluation.
 * <p>
 * This class handles polygonal geometries with any number of shells and holes.
 * The orientation of the shell and hole rings is unimportant. In order to
 * compute a correct location for a given polygonal geometry, it is essential
 * that <b>all</b> segments are counted which
 * <ul>
 * <li>touch the ray
 * <li>lie in in any ring which may contain the point
 * </ul>
 * The only exception is when the point-on-segment situation is detected, in
 * which case no further processing is required. The implication of the above
 * rule is that segments which can be a priori determined to <i>not</i> touch
 * the ray (i.e. by a test of their bounding box or Y-extent) do not need to be
 * counted. This allows for optimization by indexing.
 *
 * @constructor
 */
jsts.algorithm.RayCrossingCounter = function(p) {
  this.p = p;
};


/**
 * Determines the {@link Location} of a point in a ring. This method is an
 * exemplar of how to use this class.
 *
 * @param {Coordinate}
 *          p the point to test.
 * @param {Coordinate[]}
 *          ring an array of Coordinates forming a ring.
 * @return {int} the location of the point in the ring.
 */
jsts.algorithm.RayCrossingCounter.locatePointInRing = function(p, ring) {
  var counter = new jsts.algorithm.RayCrossingCounter(p);

  for (var i = 1; i < ring.length; i++) {
    var p1 = ring[i];
    var p2 = ring[i - 1];
    counter.countSegment(p1, p2);
    if (counter.isOnSegment())
      return counter.getLocation();
  }
  return counter.getLocation();
};


/**
 * @type {Coordinate}
 * @private
 */
jsts.algorithm.RayCrossingCounter.prototype.p = null;


/**
 * @type {int}
 * @private
 */
jsts.algorithm.RayCrossingCounter.prototype.crossingCount = 0;


/**
 * true if the test point lies on an input segment
 *
 * @type {boolean}
 * @private
 */
jsts.algorithm.RayCrossingCounter.prototype.isPointOnSegment = false;


/**
 * Counts a segment
 *
 * @param {Coordinate}
 *          p1 an endpoint of the segment.
 * @param {Coordinate}
 *          p2 another endpoint of the segment.
 */
jsts.algorithm.RayCrossingCounter.prototype.countSegment = function(p1, p2) {
  /**
   * For each segment, check if it crosses a horizontal ray running from the
   * test point in the positive x direction.
   */

  // check if the segment is strictly to the left of the test point
  if (p1.x < this.p.x && p2.x < this.p.x)
    return;

  // check if the point is equal to the current ring vertex
  if (this.p.x == p2.x && this.p.y === p2.y) {
    this.isPointOnSegment = true;
    return;
  }
  /**
   * For horizontal segments, check if the point is on the segment. Otherwise,
   * horizontal segments are not counted.
   */
  if (p1.y === this.p.y && p2.y === this.p.y) {
    var minx = p1.x;
    var maxx = p2.x;
    if (minx > maxx) {
      minx = p2.x;
      maxx = p1.x;
    }
    if (this.p.x >= minx && this.p.x <= maxx) {
      this.isPointOnSegment = true;
    }
    return;
  }
  /**
   * Evaluate all non-horizontal segments which cross a horizontal ray to the
   * right of the test pt. To avoid double-counting shared vertices, we use the
   * convention that
   * <ul>
   * <li>an upward edge includes its starting endpoint, and excludes its final
   * endpoint
   * <li>a downward edge excludes its starting endpoint, and includes its final
   * endpoint
   * </ul>
   */
  if (((p1.y > this.p.y) && (p2.y <= this.p.y)) || ((p2.y > this.p.y) && (p1.y <= this.p.y))) {
    // translate the segment so that the test point lies on the origin
    var x1 = p1.x - this.p.x;
    var y1 = p1.y - this.p.y;
    var x2 = p2.x - this.p.x;
    var y2 = p2.y - this.p.y;

    /**
     * The translated segment straddles the x-axis. Compute the sign of the
     * ordinate of intersection with the x-axis. (y2 != y1, so denominator will
     * never be 0.0)
     */
    // double xIntSign = RobustDeterminant.signOfDet2x2(x1, y1, x2, y2) / (y2
    // - y1);
    // MD - faster & more robust computation?
    var xIntSign = jsts.algorithm.RobustDeterminant.signOfDet2x2(x1, y1, x2, y2);
    if (xIntSign === 0.0) {
      this.isPointOnSegment = true;
      return;
    }
    if (y2 < y1)
      xIntSign = -xIntSign;
    // xsave = xInt;

    // System.out.println("xIntSign(" + x1 + ", " + y1 + ", " + x2 + ", " + y2
    // + " = " + xIntSign);
    // The segment crosses the ray if the sign is strictly positive.
    if (xIntSign > 0.0) {
      this.crossingCount++;
    }
  }
};


/**
 * Reports whether the point lies exactly on one of the supplied segments. This
 * method may be called at any time as segments are processed. If the result of
 * this method is <tt>true</tt>, no further segments need be supplied, since
 * the result will never change again.
 *
 * @return {boolean} true if the point lies exactly on a segment.
 */
jsts.algorithm.RayCrossingCounter.prototype.isOnSegment = function() {
  return jsts.geom.isPointOnSegment;
};


/**
 * Gets the {@link Location} of the point relative to the ring, polygon or
 * multipolygon from which the processed segments were provided.
 * <p>
 * This method only determines the correct location if <b>all</b> relevant
 * segments must have been processed.
 *
 * @return {int} the Location of the point.
 */
jsts.algorithm.RayCrossingCounter.prototype.getLocation = function() {
  if (this.isPointOnSegment)
    return jsts.geom.Location.BOUNDARY;

  // The point is in the interior of the ring if the number of X-crossings is
  // odd.
  if ((this.crossingCount % 2) === 1) {
    return jsts.geom.Location.INTERIOR;
  }
  return jsts.geom.Location.EXTERIOR;
};


/**
 * Tests whether the point lies in or on the ring, polygon or multipolygon from
 * which the processed segments were provided.
 * <p>
 * This method only determines the correct location if <b>all</b> relevant
 * segments must have been processed.
 *
 * @return {boolean} true if the point lies in or on the supplied polygon.
 */
jsts.algorithm.RayCrossingCounter.prototype.isPointInPolygon = function() {
  return this.getLocation() !== jsts.geom.Location.EXTERIOR;
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Implements an algorithm to compute the
 * sign of a 2x2 determinant for double precision values robustly.
 * It is a direct translation of code developed by Olivier Devillers.
 * <p>
 * The original code carries the following copyright notice:
 *
 * <pre>
 *************************************************************************
 * Author : Olivier Devillers
 * Olivier.Devillers@sophia.inria.fr
 * http:/www.inria.fr:/prisme/personnel/devillers/anglais/determinant.html
 **************************************************************************
 *
 **************************************************************************
 *              Copyright (c) 1995  by  INRIA Prisme Project
 *                  BP 93 06902 Sophia Antipolis Cedex, France.
 *                           All rights reserved
 **************************************************************************
 * </pre>
 * @constructor
 */
jsts.algorithm.RobustDeterminant = function() {

};


/**
 * Computes the sign of the determinant of the 2x2 matrix
 * with the given entries, in a robust way.
 *
 * @param {Number}
 *        x1 X-1.
 * @param {Number}
 *        y1 Y-1.
 * @param {Number}
 *        x2 X-2.
 * @param {Number}
 *        y2 Y-1.
 *
 * @return {Number}
 *         -1 if the determinant is negative,.
 * @return {Number}
 *         1 if the determinant is positive,.
 * @return {Number}
 *         0 if the determinant is 0.
 */
jsts.algorithm.RobustDeterminant.signOfDet2x2 = function(x1, y1, x2, y2) {
  //returns -1 if the determinant is negative,
  // returns  1 if the determinant is positive,
  // retunrs  0 if the determinant is null.
  var sign, swap, k, count;
  count = 0;

  sign = 1;

  /*
   *  testing null entries
   */
  if ((x1 === 0.0) || (y2 === 0.0)) {
    if ((y1 === 0.0) || (x2 === 0.0)) {
      return 0;
    }
    else if (y1 > 0) {
      if (x2 > 0) {
        return -sign;
      }
      else {
        return sign;
      }
    }
    else {
      if (x2 > 0) {
        return sign;
      }
      else {
        return -sign;
      }
    }
  }
  if ((y1 === 0.0) || (x2 === 0.0)) {
    if (y2 > 0) {
      if (x1 > 0) {
        return sign;
      }
      else {
        return -sign;
      }
    }
    else {
      if (x1 > 0) {
        return -sign;
      }
      else {
        return sign;
      }
    }
  }

  /*
   *  making y coordinates positive and permuting the entries
   */
  /*
   *  so that y2 is the biggest one
   */
  if (0.0 < y1) {
    if (0.0 < y2) {
      if (y1 > y2) {
        sign = -sign;
        swap = x1;
        x1 = x2;
        x2 = swap;
        swap = y1;
        y1 = y2;
        y2 = swap;
      }
    }
    else {
      if (y1 <= -y2) {
        sign = -sign;
        x2 = -x2;
        y2 = -y2;
      }
      else {
        swap = x1;
        x1 = -x2;
        x2 = swap;
        swap = y1;
        y1 = -y2;
        y2 = swap;
      }
    }
  }
  else {
    if (0.0 < y2) {
      if (-y1 <= y2) {
        sign = -sign;
        x1 = -x1;
        y1 = -y1;
      }
      else {
        swap = -x1;
        x1 = x2;
        x2 = swap;
        swap = -y1;
        y1 = y2;
        y2 = swap;
      }
    }
    else {
      if (y1 >= y2) {
        x1 = -x1;
        y1 = -y1;
        x2 = -x2;
        y2 = -y2;
      }
      else {
        sign = -sign;
        swap = -x1;
        x1 = -x2;
        x2 = swap;
        swap = -y1;
        y1 = -y2;
        y2 = swap;
      }
    }
  }

  /*
   *  making x coordinates positive
   */
  /*
   *  if |x2| < |x1| one can conclude
   */
  if (0.0 < x1) {
    if (0.0 < x2) {
      if (x1 > x2) {
        return sign;
      }
    }
    else {
      return sign;
    }
  }
  else {
    if (0.0 < x2) {
      return -sign;
    }
    else {
      if (x1 >= x2) {
        sign = -sign;
        x1 = -x1;
        x2 = -x2;
      }
      else {
        return -sign;
      }
    }
  }

  /*
   *  all entries strictly positive   x1 <= x2 and y1 <= y2
   */
  while (true) {
    count = count + 1;
    // MD - UNSAFE HACK for testing only!
    //    k = (int) (x2 / x1);
    k = Math.floor(x2 / x1);
    x2 = x2 - k * x1;
    y2 = y2 - k * y1;

    /*
     *  testing if R (new U2) is in U1 rectangle
     */
    if (y2 < 0.0) {
      return -sign;
    }
    if (y2 > y1) {
      return sign;
    }

    /*
     *  finding R'
     */
    if (x1 > x2 + x2) {
      if (y1 < y2 + y2) {
        return sign;
      }
    }
    else {
      if (y1 > y2 + y2) {
        return -sign;
      }
      else {
        x2 = x1 - x2;
        y2 = y1 - y2;
        sign = -sign;
      }
    }
    if (y2 === 0.0) {
      if (x2 === 0.0) {
        return 0;
      }
      else {
        return -sign;
      }
    }
    if (x2 === 0.0) {
      return sign;
    }

    /*
     *  exchange 1 and 2 role.
     */
    // MD - UNSAFE HACK for testing only!
    //    k = (int) (x1 / x2);
    k = Math.floor(x1 / x2);
    x1 = x1 - k * x2;
    y1 = y1 - k * y2;

    /*
     *  testing if R (new U1) is in U2 rectangle
     */
    if (y1 < 0.0) {
      return sign;
    }
    if (y1 > y2) {
      return -sign;
    }

    /*
     *  finding R'
     */
    if (x2 > x1 + x1) {
      if (y2 < y1 + y1) {
        return -sign;
      }
    }
    else {
      if (y2 > y1 + y1) {
        return sign;
      }
      else {
        x1 = x2 - x1;
        y1 = y2 - y1;
        sign = -sign;
      }
    }
    if (y1 === 0.0) {
      if (x1 === 0.0) {
        return 0;
      }
      else {
        return sign;
      }
    }
    if (x1 === 0.0) {
      return -sign;
    }
  }
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


/**
 * @requires jsts/algorithm/LineIntersector.js
 */



/**
 * A robust version of {@LineIntersector}.
 *
 * @constructor
 * @augments jsts.algorithm.LineIntersector
 */
jsts.algorithm.RobustLineIntersector = function() {
  jsts.algorithm.RobustLineIntersector.prototype.constructor.call(this);
};

jsts.algorithm.RobustLineIntersector.prototype = new jsts.algorithm.LineIntersector();


/**
 * @param {Coordinate}
 *          p
 * @param {Coordinate}
 *          p1
 * @param {Coordinate}
 *          p2
 */
jsts.algorithm.RobustLineIntersector.prototype.computeIntersection = function(
    p, p1, p2) {

  if (arguments.length === 4) {
    jsts.algorithm.LineIntersector.prototype.computeIntersection.apply(this, arguments);
    return;
  }

  this._isProper = false;
  // do between check first, since it is faster than the orientation test
  if (jsts.geom.Envelope.intersects(p1, p2, p)) {
    if ((jsts.algorithm.CGAlgorithms.orientationIndex(p1, p2, p) === 0) &&
        (jsts.algorithm.CGAlgorithms.orientationIndex(p2, p1, p) === 0)) {
      this._isProper = true;
      if (p.equals(p1) || p.equals(p2)) {
        this._isProper = false;
      }
      this.result = jsts.algorithm.LineIntersector.POINT_INTERSECTION;
      return;
    }
  }
  this.result = jsts.algorithm.LineIntersector.NO_INTERSECTION;
};


/**
 * @param {Coordinate}
 *          p1
 * @param {Coordinate}
 *          p2
 * @param {Coordinate}
 *          q1
 * @param {Coordinate}
 *          q2
 * @return {int}
 * @protected
 */
jsts.algorithm.RobustLineIntersector.prototype.computeIntersect = function(p1,
    p2, q1, q2) {
  this._isProper = false;

  // first try a fast test to see if the envelopes of the lines intersect
  if (!jsts.geom.Envelope.intersects(p1, p2, q1, q2)) {
    return jsts.algorithm.LineIntersector.NO_INTERSECTION;
  }

  // for each endpoint, compute which side of the other segment it lies
  // if both endpoints lie on the same side of the other segment,
  // the segments do not intersect
  var Pq1 = jsts.algorithm.CGAlgorithms.orientationIndex(p1, p2, q1);
  var Pq2 = jsts.algorithm.CGAlgorithms.orientationIndex(p1, p2, q2);

  if ((Pq1 > 0 && Pq2 > 0) || (Pq1 < 0 && Pq2 < 0)) {
    return jsts.algorithm.LineIntersector.NO_INTERSECTION;
  }

  var Qp1 = jsts.algorithm.CGAlgorithms.orientationIndex(q1, q2, p1);
  var Qp2 = jsts.algorithm.CGAlgorithms.orientationIndex(q1, q2, p2);

  if ((Qp1 > 0 && Qp2 > 0) || (Qp1 < 0 && Qp2 < 0)) {
    return jsts.algorithm.LineIntersector.NO_INTERSECTION;
  }

  var collinear = Pq1 === 0 && Pq2 === 0 && Qp1 === 0 && Qp2 === 0;
  if (collinear) {
    return this.computeCollinearIntersection(p1, p2, q1, q2);
  }

  /**
   * At this point we know that there is a single intersection point (since the
   * lines are not collinear).
   */

  /**
   * Check if the intersection is an endpoint. If it is, copy the endpoint as
   * the intersection point. Copying the point rather than computing it ensures
   * the point has the exact value, which is important for robustness. It is
   * sufficient to simply check for an endpoint which is on the other line,
   * since at this point we know that the inputLines must intersect.
   */
  if (Pq1 === 0 || Pq2 === 0 || Qp1 === 0 || Qp2 === 0) {
    this._isProper = false;

    /**
     * Check for two equal endpoints. This is done explicitly rather than by the
     * orientation tests below in order to improve robustness.
     *
     * [An example where the orientation tests fail to be consistent is the
     * following (where the true intersection is at the shared endpoint POINT
     * (19.850257749638203 46.29709338043669)
     *
     * LINESTRING ( 19.850257749638203 46.29709338043669, 20.31970698357233
     * 46.76654261437082 ) and LINESTRING ( -48.51001596420236
     * -22.063180333403878, 19.850257749638203 46.29709338043669 )
     *
     * which used to produce the INCORRECT result: (20.31970698357233,
     * 46.76654261437082, NaN)
     *
     */
    if (p1.equals2D(q1) || p1.equals2D(q2)) {
      this.intPt[0] = p1;
    } else if (p2.equals2D(q1) || p2.equals2D(q2)) {
      this.intPt[0] = p2;
    }

    /**
     * Now check to see if any endpoint lies on the interior of the other
     * segment.
     */
    else if (Pq1 === 0) {
      this.intPt[0] = new jsts.geom.Coordinate(q1);
    } else if (Pq2 === 0) {
      this.intPt[0] = new jsts.geom.Coordinate(q2);
    } else if (Qp1 === 0) {
      this.intPt[0] = new jsts.geom.Coordinate(p1);
    } else if (Qp2 === 0) {
      this.intPt[0] = new jsts.geom.Coordinate(p2);
    }
  } else {
    this._isProper = true;
    this.intPt[0] = this.intersection(p1, p2, q1, q2);
  }
  return jsts.algorithm.LineIntersector.POINT_INTERSECTION;
};


/**
 * @param {Coordinate}
 *          p1
 * @param {Coordinate}
 *          p2
 * @param {Coordinate}
 *          q1
 * @param {Coordinate}
 *          q2
 * @return {int}
 * @private
 */
jsts.algorithm.RobustLineIntersector.prototype.computeCollinearIntersection = function(
    p1, p2, q1, q2) {
  var p1q1p2 = jsts.geom.Envelope.intersects(p1, p2, q1);
  var p1q2p2 = jsts.geom.Envelope.intersects(p1, p2, q2);
  var q1p1q2 = jsts.geom.Envelope.intersects(q1, q2, p1);
  var q1p2q2 = jsts.geom.Envelope.intersects(q1, q2, p2);

  if (p1q1p2 && p1q2p2) {
    this.intPt[0] = q1;
    this.intPt[1] = q2;
    return jsts.algorithm.LineIntersector.COLLINEAR_INTERSECTION;
  }
  if (q1p1q2 && q1p2q2) {
    this.intPt[0] = p1;
    this.intPt[1] = p2;
    return jsts.algorithm.LineIntersector.COLLINEAR_INTERSECTION;
  }
  if (p1q1p2 && q1p1q2) {
    this.intPt[0] = q1;
    this.intPt[1] = p1;
    return q1.equals(p1) && !p1q2p2 && !q1p2q2 ? jsts.algorithm.LineIntersector.POINT_INTERSECTION
        : jsts.algorithm.LineIntersector.COLLINEAR_INTERSECTION;
  }
  if (p1q1p2 && q1p2q2) {
    this.intPt[0] = q1;
    this.intPt[1] = p2;
    return q1.equals(p2) && !p1q2p2 && !q1p1q2 ? jsts.algorithm.LineIntersector.POINT_INTERSECTION
        : jsts.algorithm.LineIntersector.COLLINEAR_INTERSECTION;
  }
  if (p1q2p2 && q1p1q2) {
    this.intPt[0] = q2;
    this.intPt[1] = p1;
    return q2.equals(p1) && !p1q1p2 && !q1p2q2 ? jsts.algorithm.LineIntersector.POINT_INTERSECTION
        : jsts.algorithm.LineIntersector.COLLINEAR_INTERSECTION;
  }
  if (p1q2p2 && q1p2q2) {
    this.intPt[0] = q2;
    this.intPt[1] = p2;
    return q2.equals(p2) && !p1q1p2 && !q1p1q2 ? jsts.algorithm.LineIntersector.POINT_INTERSECTION
        : jsts.algorithm.LineIntersector.COLLINEAR_INTERSECTION;
  }
  return jsts.algorithm.LineIntersector.NO_INTERSECTION;
};


/**
 * This method computes the actual value of the intersection point. To obtain
 * the maximum precision from the intersection calculation, the coordinates are
 * normalized by subtracting the minimum ordinate values (in absolute value).
 * This has the effect of removing common significant digits from the
 * calculation to maintain more bits of precision.
 *
 * @param {Coordinate}
 *          p1
 * @param {Coordinate}
 *          p2
 * @param {Coordinate}
 *          q1
 * @param {Coordinate}
 *          q2
 * @return {Coordinate}
 * @private
 */
jsts.algorithm.RobustLineIntersector.prototype.intersection = function(p1, p2,
    q1, q2) {
  var intPt = this.intersectionWithNormalization(p1, p2, q1, q2);

  /**
   * Due to rounding it can happen that the computed intersection is outside the
   * envelopes of the input segments. Clearly this is inconsistent. This code
   * checks this condition and forces a more reasonable answer
   *
   * MD - May 4 2005 - This is still a problem. Here is a failure case:
   *
   * LINESTRING (2089426.5233462777 1180182.3877339689, 2085646.6891757075
   * 1195618.7333999649) LINESTRING (1889281.8148903656 1997547.0560044837,
   * 2259977.3672235999 483675.17050843034) int point =
   * (2097408.2633752143,1144595.8008114607)
   *
   * MD - Dec 14 2006 - This does not seem to be a failure case any longer
   */
  if (!this.isInSegmentEnvelopes(intPt)) {
    // System.out.println("Intersection outside segment envelopes: " + intPt);
    // System.out.println("Segments: " + this);
    // compute a safer result
    intPt = jsts.algorithm.CentralEndpointIntersector.getIntersection(p1, p2, q1, q2);
    // System.out.println("Snapped to " + intPt);
  }

  if (this.precisionModel !== null) {
    this.precisionModel.makePrecise(intPt);
  }

  return intPt;
};


/**
 * @param {Coordinate}
 *          p1
 * @param {Coordinate}
 *          p2
 * @param {Coordinate}
 *          q1
 * @param {Coordinate}
 *          q2
 * @return {Coordinate}
 * @private
 */
jsts.algorithm.RobustLineIntersector.prototype.intersectionWithNormalization = function(
    p1, p2, q1, q2) {
  var n1 = new jsts.geom.Coordinate(p1);
  var n2 = new jsts.geom.Coordinate(p2);
  var n3 = new jsts.geom.Coordinate(q1);
  var n4 = new jsts.geom.Coordinate(q2);
  var normPt = new jsts.geom.Coordinate();
  this.normalizeToEnvCentre(n1, n2, n3, n4, normPt);

  var intPt = this.safeHCoordinateIntersection(n1, n2, n3, n4);

  intPt.x += normPt.x;
  intPt.y += normPt.y;

  return intPt;
};


/**
 * Computes a segment intersection using homogeneous coordinates. Round-off
 * error can cause the raw computation to fail, (usually due to the segments
 * being approximately parallel). If this happens, a reasonable approximation is
 * computed instead.
 *
 * @param {Coordinate}
 *          p1 a segment endpoint.
 * @param {Coordinate}
 *          p2 a segment endpoint.
 * @param {Coordinate}
 *          q1 a segment endpoint.
 * @param {Coordinate}
 *          q2 a segment endpoint.
 * @return {Coordinate} the computed intersection point.
 * @private
 */
jsts.algorithm.RobustLineIntersector.prototype.safeHCoordinateIntersection = function(
    p1, p2, q1, q2) {
  var intPt = null;
  try {
    intPt = jsts.algorithm.HCoordinate.intersection(p1, p2, q1, q2);
  } catch (e) {
    if (e instanceof jsts.error.NotRepresentableError) {
      // System.out.println("Not calculable: " + this);
      // compute an approximate result
      intPt = jsts.algorithm.CentralEndpointIntersector.getIntersection(p1, p2,
          q1, q2);
      // System.out.println("Snapped to " + intPt);
    } else {
      throw e;
    }
  }

  return intPt;
};


/**
 * Normalize the supplied coordinates so that their minimum ordinate values lie
 * at the origin. NOTE: this normalization technique appears to cause large
 * errors in the position of the intersection point for some cases.
 *
 * @param {Coordinate}
 *          n1
 * @param {Coordinate}
 *          n2
 * @param {Coordinate}
 *          n3
 * @param {Coordinate}
 *          n4
 * @param {Coordinate}
 *          normPt
 */
jsts.algorithm.RobustLineIntersector.prototype.normalizeToMinimum = function(
    n1, n2, n3, n4, normPt) {
  normPt.x = this.smallestInAbsValue(n1.x, n2.x, n3.x, n4.x);
  normPt.y = this.smallestInAbsValue(n1.y, n2.y, n3.y, n4.y);
  n1.x -= normPt.x;
  n1.y -= normPt.y;
  n2.x -= normPt.x;
  n2.y -= normPt.y;
  n3.x -= normPt.x;
  n3.y -= normPt.y;
  n4.x -= normPt.x;
  n4.y -= normPt.y;
};


/**
 * Normalize the supplied coordinates to so that the midpoint of their
 * intersection envelope lies at the origin.
 *
 * @param {Coordinate}
 *          n00
 * @param {Coordinate}
 *          n01
 * @param {Coordinate}
 *          n10
 * @param {Coordinate}
 *          n11
 * @param {Coordinate}
 *          normPt
 */
jsts.algorithm.RobustLineIntersector.prototype.normalizeToEnvCentre = function(
    n00, n01, n10, n11, normPt) {
  var minX0 = n00.x < n01.x ? n00.x : n01.x;
  var minY0 = n00.y < n01.y ? n00.y : n01.y;
  var maxX0 = n00.x > n01.x ? n00.x : n01.x;
  var maxY0 = n00.y > n01.y ? n00.y : n01.y;

  var minX1 = n10.x < n11.x ? n10.x : n11.x;
  var minY1 = n10.y < n11.y ? n10.y : n11.y;
  var maxX1 = n10.x > n11.x ? n10.x : n11.x;
  var maxY1 = n10.y > n11.y ? n10.y : n11.y;

  var intMinX = minX0 > minX1 ? minX0 : minX1;
  var intMaxX = maxX0 < maxX1 ? maxX0 : maxX1;
  var intMinY = minY0 > minY1 ? minY0 : minY1;
  var intMaxY = maxY0 < maxY1 ? maxY0 : maxY1;

  var intMidX = (intMinX + intMaxX) / 2.0;
  var intMidY = (intMinY + intMaxY) / 2.0;
  normPt.x = intMidX;
  normPt.y = intMidY;

  /*
  // equilavalent code using more modular but slower method
  Envelope env0 = new Envelope(n00, n01);
  Envelope env1 = new Envelope(n10, n11);
  Envelope intEnv = env0.intersection(env1);
  Coordinate intMidPt = intEnv.centre();

  normPt.x = intMidPt.x;
  normPt.y = intMidPt.y;
  */

  n00.x -= normPt.x;
  n00.y -= normPt.y;
  n01.x -= normPt.x;
  n01.y -= normPt.y;
  n10.x -= normPt.x;
  n10.y -= normPt.y;
  n11.x -= normPt.x;
  n11.y -= normPt.y;
};


/**
 * @param {double}
 *          x1
 * @param {double}
 *          x2
 * @param {double}
 *          x3
 * @param {double}
 *          x4
 * @return {double}
 */
jsts.algorithm.RobustLineIntersector.prototype.smallestInAbsValue = function(
    x1, x2, x3, x4) {
  var x = x1;
  var xabs = Math.abs(x);
  if (Math.abs(x2) < xabs) {
    x = x2;
    xabs = Math.abs(x2);
  }
  if (Math.abs(x3) < xabs) {
    x = x3;
    xabs = Math.abs(x3);
  }
  if (Math.abs(x4) < xabs) {
    x = x4;
  }
  return x;
};


/**
 * Test whether a point lies in the envelopes of both input segments. A
 * correctly computed intersection point should return <code>true</code> for
 * this test. Since this test is for debugging purposes only, no attempt is made
 * to optimize the envelope test.
 *
 * @param {Coordinate}
 *          intPt
 * @return {boolean} <code>true</code> if the input point lies within both
 *         input segment envelopes.
 * @private
 */
jsts.algorithm.RobustLineIntersector.prototype.isInSegmentEnvelopes = function(
    intPt) {
  var env0 = new jsts.geom.Envelope(this.inputLines[0][0],
      this.inputLines[0][1]);
  var env1 = new jsts.geom.Envelope(this.inputLines[1][0],
      this.inputLines[1][1]);
  return env0.contains(intPt) && env1.contains(intPt);
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


/**
 * @namespace
 */
jsts.algorithm.locate = {};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Computes the location of points relative to a {@link Polygonal}
 * {@link Geometry}, using a simple O(n) algorithm. This algorithm is suitable
 * for use in cases where only one or a few points will be tested against a
 * given area.
 * <p>
 * The algorithm used is only guaranteed to return correct results for points
 * which are <b>not</b> on the boundary of the Geometry.
 *
 * @constructor
 * @augments {PointOnGeometryLocator}
 */
jsts.algorithm.locate.SimplePointInAreaLocator = function(geom) {
  this.geom = geom;
};


/**
 * Determines the {@link Location} of a point in an areal {@link Geometry}.
 * Currently this will never return a value of BOUNDARY.
 *
 * @param p
 *          the point to test.
 * @param geom
 *          the areal geometry to test.
 * @return the Location of the point in the geometry.
 */
jsts.algorithm.locate.SimplePointInAreaLocator.locate = function(p, geom) {
  if (geom.isEmpty())
    return jsts.geom.Location.EXTERIOR;

  if (jsts.algorithm.locate.SimplePointInAreaLocator.containsPoint(p, geom))
    return jsts.geom.Location.INTERIOR;
  return jsts.geom.Location.EXTERIOR;
};

jsts.algorithm.locate.SimplePointInAreaLocator.containsPoint = function(p, geom) {
  if (geom instanceof jsts.geom.Polygon) {
    return jsts.algorithm.locate.SimplePointInAreaLocator
        .containsPointInPolygon(p, geom);
  } else if (geom instanceof jsts.geom.GeometryCollection) {
    for (var i = 0; i < geom.geometries.length; i++) {
      var g2 = geom.geometries[i];
      if (g2 !== geom)
        if (jsts.algorithm.locate.SimplePointInAreaLocator.containsPoint(p, g2))
          return true;
    }
  }
  return false;
};

jsts.algorithm.locate.SimplePointInAreaLocator.containsPointInPolygon = function(
    p, poly) {
  if (poly.isEmpty())
    return false;
  var shell = poly.getExteriorRing();
  if (!jsts.algorithm.locate.SimplePointInAreaLocator.isPointInRing(p, shell))
    return false;
  // now test if the point lies in or on the holes
  for (var i = 0; i < poly.getNumInteriorRing(); i++) {
    var hole = poly.getInteriorRingN(i);
    if (jsts.algorithm.locate.SimplePointInAreaLocator.isPointInRing(p, hole))
      return false;
  }
  return true;
};


/**
 * Determines whether a point lies in a LinearRing, using the ring envelope to
 * short-circuit if possible.
 *
 * @param p
 *          the point to test.
 * @param ring
 *          a linear ring.
 * @return true if the point lies inside the ring.
 */
jsts.algorithm.locate.SimplePointInAreaLocator.isPointInRing = function(p, ring) {
  // short-circuit if point is not in ring envelope
  if (!ring.getEnvelopeInternal().intersects(p))
    return false;
  return jsts.algorithm.CGAlgorithms.isPointInRing(p, ring.getCoordinates());
};

jsts.algorithm.locate.SimplePointInAreaLocator.prototype.geom = null;


jsts.algorithm.locate.SimplePointInAreaLocator.prototype.locate = function(p) {
  return jsts.algorithm.locate.SimplePointInAreaLocator.locate(p, geom);
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


/**
 * @namespace
 */
jsts.planargraph = {

};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Represents a directed graph which is embeddable in a planar surface.
 * <p>
 * This class and the other classes in this package serve as a framework for
 * building planar graphs for specific algorithms. This class must be subclassed
 * to expose appropriate methods to construct the graph. This allows controlling
 * the types of graph components ({@link DirectedEdge}s, {@link Edge}s and
 * {@link Node}s) which can be added to the graph. An application which uses
 * the graph framework will almost always provide subclasses for one or more
 * graph components, which hold application-specific data and graph algorithms.
 *
 * @constructor
 */
jsts.planargraph.PlanarGraph = function() {
  this.nodeMap = {};

  this.edges = [];
  this.dirEdges = [];
};

jsts.planargraph.PlanarGraph.prototype.edges = null;
jsts.planargraph.PlanarGraph.prototype.dirEdges = null;


/**
 * @type {Object}
 */
jsts.planargraph.PlanarGraph.prototype.nodeMap = null;

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


/**
 * @namespace
 */
jsts.geomgraph = {

};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * A GraphComponent is the parent class for the objects' that form a graph. Each
 * GraphComponent can carry a Label.
 *
 * @constructor
 */
jsts.geomgraph.GraphComponent = function(label) {
  this.label = label;
};


/**
 * @type {Label}
 * @protected
 */
jsts.geomgraph.GraphComponent.prototype.label = null;


/**
 * isInResult indicates if this component has already been included in the
 * result
 *
 * @type {boolean}
 * @private
 */
jsts.geomgraph.GraphComponent.prototype.isInResult = false;


/**
 * @type {boolean}
 * @private
 */
jsts.geomgraph.GraphComponent.prototype.isCovered = false;


/**
 * @type {boolean}
 * @private
 */
jsts.geomgraph.GraphComponent.prototype.isCoveredSet = false;


/**
 * @type {boolean}
 * @private
 */
jsts.geomgraph.GraphComponent.prototype.isVisited = false;

jsts.geomgraph.GraphComponent.prototype.getLabel = function() {
  return this.label;
};
jsts.geomgraph.GraphComponent.prototype.setLabel = function(label) {
  if (arguments.length == 2) {
    this.setLabel2.apply(this, arguments);
    return;
  }

  this.label = label;
};


/**
 * @param {boolean}
 *          isInResult
 */
jsts.geomgraph.GraphComponent.prototype.setInResult = function(isInResult) {
  this.isInResult = isInResult;
};


/**
 * @return {boolean}
 */
jsts.geomgraph.GraphComponent.prototype.isInResult = function() {
  return this.isInResult;
};


/**
 * @param {boolean}
 *          isCovered
 */
jsts.geomgraph.GraphComponent.prototype.setCovered = function(isCovered) {
  this.isCovered = isCovered;
  this.isCoveredSet = true;
};


/**
 * @return {boolean}
 */
jsts.geomgraph.GraphComponent.prototype.isCovered = function() {
  return this.isCovered;
};


/**
 * @return {boolean}
 */
jsts.geomgraph.GraphComponent.prototype.isCoveredSet = function() {
  return this.isCoveredSet;
};


/**
 * @return {boolean}
 */
jsts.geomgraph.GraphComponent.prototype.isVisited = function() {
  return this.isVisited;
};


/**
 * @param {boolean}
 *          isVisited
 */
jsts.geomgraph.GraphComponent.prototype.setVisited = function(isVisited) {
  this.isVisited = isVisited;
};


/**
 * @return {Coordinate} a coordinate in this component (or null, if there are
 *         none).
 */
jsts.geomgraph.GraphComponent.prototype.getCoordinate = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * compute the contribution to an IM for this component
 *
 * @param {IntersectionMatrix}
 *          im
 * @protected
 */
jsts.geomgraph.GraphComponent.prototype.computeIM = function(im) {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * An isolated component is one that does not intersect or touch any other
 * component. This is the case if the label has valid locations for only a
 * single Geometry.
 *
 * @return true if this component is isolated.
 */
jsts.geomgraph.GraphComponent.prototype.isIsolated = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * Update the IM with the contribution for this component. A component only
 * contributes if it has a labelling for both parent geometries
 *
 * @param {IntersectionMatrix}
 *          im
 */
jsts.geomgraph.GraphComponent.prototype.updateIM = function(im) {
  if (!(this.label.getGeometryCount() >= 2)) {
    throw new jsts.error.NotRepresentableError('found partial label');
  }
  this.computeIM(im);
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geomgraph/GraphComponent.js
 */



/**
 * @constructor
 * @augments jsts.geomgraph.GraphComponent
 */
jsts.geomgraph.Node = function(coord, edges) {
  this.coord = coord;
  this.edges = edges;
  this.label = new jsts.geomgraph.Label(0, jsts.geom.Location.NONE);
};

jsts.geomgraph.Node.prototype = new jsts.geomgraph.GraphComponent();


/**
 * only non-null if this node is precise
 */
jsts.geomgraph.Node.prototype.coord = null;
jsts.geomgraph.Node.prototype.edges = null;

jsts.geomgraph.Node.prototype.isIsolated = function() {
  return (this.label.getGeometryCount() == 1);
};

jsts.geomgraph.Node.prototype.setLabel2 = function(argIndex,  onLocation) {
  if (this.label === null) {
    this.label = new jsts.geomgraph.Label(argIndex, onLocation);
  }
  else
    this.label.setLocation(argIndex, onLocation);
};


/**
 * Updates the label of a node to BOUNDARY,
 * obeying the mod-2 boundaryDetermination rule.
 */
jsts.geomgraph.Node.prototype.setLabelBoundary = function(argIndex) {
  // determine the current location for the point (if any)
  var loc = jsts.geom.Location.NONE;
  if (this.label !== null)
    loc = this.label.getLocation(argIndex);
  // flip the loc
  var newLoc;
  switch (loc) {
    case jsts.geom.Location.BOUNDARY: newLoc = jsts.geom.Location.INTERIOR; break;
    case jsts.geom.Location.INTERIOR: newLoc = jsts.geom.Location.BOUNDARY; break;
    default: newLoc = jsts.geom.Location.BOUNDARY; break;
  }
  this.label.setLocation(argIndex, newLoc);
};


/**
 * Add the edge to the list of edges at this node
 */
jsts.geomgraph.Node.prototype.add = function(e)
    {
  // Assert: start pt of e is equal to node point
  this.edges.insert(e);
  e.setNode(this);
};

jsts.geomgraph.Node.prototype.getCoordinate = function() {
  return this.coord;
};
jsts.geomgraph.Node.prototype.getEdges = function() {
  return this.edges;
};

// TODO: port rest

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * @constructor
 */
jsts.geomgraph.NodeFactory = function() {

};


/**
 * The basic node constructor does not allow for incident edges
 */
jsts.geomgraph.NodeFactory.prototype.createNode = function(coord) {
  return new jsts.geomgraph.Node(coord, null);
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * A map of nodes, indexed by the coordinate of the node
 *
 * @constructor
 */
jsts.geomgraph.NodeMap = function(nodeFactory) {
  this.nodeMap = {};
  this.nodeFact = nodeFactory;
};


/**
 * NOTE: In In JSTS a JS object replaces TreeMap. Sorting is done when needed.
 */
jsts.geomgraph.NodeMap.prototype.nodeMap = null;

jsts.geomgraph.NodeMap.prototype.nodeFact = null;


/**
 * This method expects that a node has a coordinate value.
 *
 * @param {Coordinate/Node}
 *          arg
 * @return {Node}
 */
jsts.geomgraph.NodeMap.prototype.addNode = function(arg) {
  var node, coord;

  if (arg instanceof jsts.geom.Coordinate) {
    coord = arg;
    node = this.nodeMap[coord];
    if (node === undefined) {
      node = this.nodeFact.createNode(coord);
      this.nodeMap[coord] = node;
    }
    return node;
  } else if (arg instanceof jsts.geomgraph.Node) {
    var sn = arg;
    node = nodeMap[n.getCoordinate()];
    if (node === undefined) {
      this.nodeMap[n.getCoordinate()] = n;
      return n;
    }
    node.mergeLabel(n);
    return node;
  }
};


/**
 * Adds a node for the start point of this EdgeEnd (if one does not already
 * exist in this map). Adds the EdgeEnd to the (possibly new) node.
 *
 * @param {EdgeEnd}
 *          e
 */
jsts.geomgraph.NodeMap.prototype.add = function(e) {
  var p = e.getCoordinate();
  var n = this.addNode(p);
  n.add(e);
};


/**
 * @param {Coordinate}
 *          coord
 * @return {Node} the node if found; null otherwise.
 */
jsts.geomgraph.NodeMap.prototype.find = function(coord) {
  return this.nodeMap[coord];
};


/**
 * @return {Node[]}
 */
jsts.geomgraph.NodeMap.prototype.values = function() {
  var array = [];
  for (var key in this.nodeMap) {
    if (this.nodeMap.hasOwnProperty(key)) {
      array.push(this.nodeMap[key]);
    }
  }

  var compare = function(a,b) {
    return a.getCoordinate().compareTo(b.getCoordinate());
  };
  array.sort(compare);

  return array;
};


/**
 * @param {int}
 *          geomIndex
 * @return {Node[]}
 */
jsts.geomgraph.NodeMap.prototype.getBoundaryNodes = function(geomIndex) {
  var bdyNodes = [];
  var i, values = this.values();
  for (i = 0; i < values.length; i++) {
    var node = values[i];
    if (node.getLabel().getLocation(geomIndex) === jsts.geom.Location.BOUNDARY)
      bdyNodes.push(node);
  }
  return bdyNodes;
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geomgraph/GraphComponent.js
 */



/**
 * @param {Coordinate[]}
 *          pts
 * @param {Label}
 *          label
 * @augments jsts.geomgraph.GraphComponent
 * @constructor
 */
jsts.geomgraph.Edge = function(pts, label) {
  this.pts = pts;
  this.label = label;
  // this.mce = new MonotoneChainEdge();
  // this.depth = new Depth();
  this.eiList = new jsts.geomgraph.EdgeIntersectionList(this);
};

jsts.geomgraph.Edge.prototype = new jsts.geomgraph.GraphComponent();


/**
 * Updates an IM from the label for an edge. Handles edges from both L and A
 * geometries.
 */
jsts.geomgraph.Edge.updateIM = function(label, im) {
  im.setAtLeastIfValid(label.getLocation(0, jsts.geomgraph.Position.ON), label
      .getLocation(1, jsts.geomgraph.Position.ON), 1);
  if (label.isArea()) {
    im.setAtLeastIfValid(label.getLocation(0, jsts.geomgraph.Position.LEFT),
        label.getLocation(1, jsts.geomgraph.Position.LEFT), 2);
    im.setAtLeastIfValid(label.getLocation(0, jsts.geomgraph.Position.RIGHT),
        label.getLocation(1, jsts.geomgraph.Position.RIGHT), 2);
  }
};


/**
 * @private
 */
jsts.geomgraph.Edge.prototype.pts = null;


/**
 * @private
 */
jsts.geomgraph.Edge.prototype.env = null;


/**
 * @private
 */
jsts.geomgraph.Edge.prototype.name = null;


/**
 * @type {MonotoneChainEdge}
 * @private
 */
jsts.geomgraph.Edge.prototype.mce = null;


/**
 * @private
 */
jsts.geomgraph.Edge.prototype._isIsolated = true;


/**
 * @type {Depth}
 * @private
 */
jsts.geomgraph.Edge.prototype.depth = null;


/**
 * // the change in area depth from the R to L side of this edge
 */
jsts.geomgraph.Edge.prototype.depthDelta = 0;


/**
 * @type {jsts.geomgraph.EdgeIntersectionList}
 * @private
 */
jsts.geomgraph.Edge.prototype.eiList = null;


/**
 * @return {int}
 */
jsts.geomgraph.Edge.prototype.getNumPoints = function() {
  return this.pts.length;
};


/**
 * @return {Coordinate[]}
 */
jsts.geomgraph.Edge.prototype.getCoordinates = function() {
  return this.pts;
};


/**
 * @param {int}
 *          i
 * @return {Coordinate}
 */
jsts.geomgraph.Edge.prototype.getCoordinate = function(i) {
  if (i === undefined) {
    if (this.pts.length > 0) {
      return this.pts[0];
    } else {
      return null;
    }
  }

  return this.pts[i];
};


/**
 * @return {boolean}
 */
jsts.geomgraph.Edge.prototype.isClosed = function() {
  return this.pts[0].equals(this.pts[this.pts.length - 1]);
};


jsts.geomgraph.Edge.prototype.setIsolated = function(isIsolated) {
  this._isIsolated = isIsolated;
};
jsts.geomgraph.Edge.prototype.isIsolated = function() {
  return this._isIsolated;
};


/**
 * Adds EdgeIntersections for one or both intersections found for a segment of
 * an edge to the edge intersection list.
 *
 * @param {LineIntersector}
 *          li
 * @param {int}
 *          segmentIndex
 * @param {int}
 *          geomIndex
 */
jsts.geomgraph.Edge.prototype.addIntersections = function(li, segmentIndex,
    geomIndex) {
  for (var i = 0; i < li.getIntersectionNum(); i++) {
    this.addIntersection(li, segmentIndex, geomIndex, i);
  }
};


/**
 * Add an EdgeIntersection for intersection intIndex. An intersection that falls
 * exactly on a vertex of the edge is normalized to use the higher of the two
 * possible segmentIndexes
 *
 * @param {LineIntersector}
 *          li
 * @param {int}
 *          segmentIndex
 * @param {int}
 *          geomIndex
 * @param {int}
 *          intIndex
 */
jsts.geomgraph.Edge.prototype.addIntersection = function(li, segmentIndex,
    geomIndex, intIndex) {
  var intPt = new jsts.geom.Coordinate(li.getIntersection(intIndex));
  var normalizedSegmentIndex = segmentIndex;
  var dist = li.getEdgeDistance(geomIndex, intIndex);
  //normalize the intersection point location
  var nextSegIndex = normalizedSegmentIndex + 1;
  if (nextSegIndex < this.pts.length) {
    var nextPt = this.pts[nextSegIndex];

    // Normalize segment index if intPt falls on vertex
    // The check for point equality is 2D only - Z values are ignored
    if (intPt.equals2D(nextPt)) {
      normalizedSegmentIndex = nextSegIndex;
      dist = 0.0;
    }
  }
  /**
   * Add the intersection point to edge intersection list.
   */
  var ei = this.eiList.add(intPt, normalizedSegmentIndex, dist);
};


/**
 * @return {int}
 */
jsts.geomgraph.Edge.prototype.getMaximumSegmentIndex = function() {
  return this.pts.length - 1;
};

jsts.geomgraph.Edge.prototype.getEdgeIntersectionList = function() {
  return this.eiList;
};


/**
 * Update the IM with the contribution for this component. A component only
 * contributes if it has a labelling for both parent geometries
 */
jsts.geomgraph.Edge.prototype.computeIM = function(im) {
  jsts.geomgraph.Edge.updateIM(this.label, im);
};

// TODO: port rest..

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Models the end of an edge incident on a node.
 * EdgeEnds have a direction
 * determined by the direction of the ray from the initial
 * point to the next point.
 * EdgeEnds are comparable under the ordering
 * "a has a greater angle with the x-axis than b".
 * This ordering is used to sort EdgeEnds around a node.
 * @param {Edge} edge
 * @param {Coordinate} p0
 * @param {Coordinate} p1
 * @param {Label} label
 * @constructor
 */
jsts.geomgraph.EdgeEnd = function(edge,  p0,  p1,  label) {
  this.edge = edge;
  if (p0 !== undefined) {
    if (p1 === undefined) {
      throw new jsts.error.IllegalArgumentError('expected two coords');
    }
    this.init(p0, p1);
    this.label = label;
  }
};


/**
 * the parent edge of this edge end
 * @type {Edge}
 * @protected
 */
jsts.geomgraph.EdgeEnd.prototype.edge = null;


/**
   * @type {Label}
   * @protected
   */
jsts.geomgraph.EdgeEnd.prototype.label = null;


/**
 * the node this edge end originates at
 * @type {Node}
 * @private
 */
jsts.geomgraph.EdgeEnd.prototype.node = null;


/**
   * points of initial line segment
   * @type {Coordinate}
   * @private
   */
jsts.geomgraph.EdgeEnd.prototype.p0 = null;
jsts.geomgraph.EdgeEnd.prototype.p1 = null;


/**
   * the direction vector for this edge from its starting point
   * @type {double}
   * @private
   */
jsts.geomgraph.EdgeEnd.prototype.dx = null;
jsts.geomgraph.EdgeEnd.prototype.dy = null;


/**
   * @type {int}
   * @private
   */
jsts.geomgraph.EdgeEnd.prototype.quadrant = null;


/**
   * @param {Coordinate} p0
   * @param {Coordinate} p1
   * @protected
   */
jsts.geomgraph.EdgeEnd.prototype.init = function(p0,  p1)  {
  this.p0 = p0;
  this.p1 = p1;
  this.dx = p1.x - p0.x;
  this.dy = p1.y - p0.y;
  this.quadrant = jsts.geomgraph.Quadrant.quadrant(this.dx, this.dy);
  // TODO: Assert.isTrue(! (dx == 0 && dy == 0), 'EdgeEnd with identical endpoints found');
};

jsts.geomgraph.EdgeEnd.prototype.getEdge = function() { return this.edge; };

jsts.geomgraph.EdgeEnd.prototype.getLabel = function() { return this.label; };

jsts.geomgraph.EdgeEnd.prototype.getCoordinate = function() { return this.p0; };

jsts.geomgraph.EdgeEnd.prototype.getDirectedCoordinate = function() { return this.p1; };

jsts.geomgraph.EdgeEnd.prototype.getQuadrant = function() { return this.quadrant; };

jsts.geomgraph.EdgeEnd.prototype.getDx = function() { return this.dx; };

jsts.geomgraph.EdgeEnd.prototype.getDy = function() { return this.dy; };


jsts.geomgraph.EdgeEnd.prototype.setNode = function(node) { this.node = node; };

jsts.geomgraph.EdgeEnd.prototype.getNode = function() { return this.node; };

jsts.geomgraph.EdgeEnd.prototype.compareTo = function(e)  {
  return this.compareDirection(e);
};


/**
   * Implements the total order relation:
   * <p>
   *    a has a greater angle with the positive x-axis than b
   * <p>
   * Using the obvious algorithm of simply computing the angle is not robust,
   * since the angle calculation is obviously susceptible to roundoff.
   * A robust algorithm is:
   * - first compare the quadrant.  If the quadrants
   * are different, it it trivial to determine which vector is "greater".
   * - if the vectors lie in the same quadrant, the computeOrientation function
   * can be used to decide the relative orientation of the vectors.
   * @param {EdgeEnd} e
   * @return {int}
   */
jsts.geomgraph.EdgeEnd.prototype.compareDirection = function(e)  {
  if (this.dx === e.dx && this.dy === e.dy)
    return 0;
  // if the rays are in different quadrants, determining the ordering is trivial
  if (this.quadrant > e.quadrant) return 1;
  if (this.quadrant < e.quadrant) return -1;
  // vectors are in the same quadrant - check relative orientation of direction vectors
  // this is > e if it is CCW of e
  return jsts.algorithm.CGAlgorithms.computeOrientation(e.p0, e.p1, this.p1);
};

jsts.geomgraph.EdgeEnd.prototype.computeLabel = function(boundaryNodeRule)  {
  // subclasses should override this if they are using labels
};

jsts.geomgraph.EdgeEnd.prototype.toString = function() {
  // TODO: this hashcode might not be equivalent to JTS code, so maps containg edgeends could be a cause of bugs
  return '' + this.dx + this.dy + this.quadrant;
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geom/Location.js
 */



/**
 * A EdgeEndStar is an ordered list of EdgeEnds around a node. They are
 * maintained in CCW order (starting with the positive x-axis) around the node
 * for efficient lookup and topology building.
 *
 * @constructor
 */
jsts.geomgraph.EdgeEndStar = function() {
  this.edgeMap = {};
  this.edgeList = null;
  this.ptInAreaLocation = [jsts.geom.Location.NONE, jsts.geom.Location.NONE];
};


/**
 * A map which maintains the edges in sorted order around the node
 *
 * NOTE: In In JSTS a JS object replaces TreeMap. Sorting is done when needed.
 *
 * @protected
 */
jsts.geomgraph.EdgeEndStar.prototype.edgeMap = null;


/**
 * A list of all outgoing edges in the result, in CCW order
 *
 * @protected
 */
jsts.geomgraph.EdgeEndStar.prototype.edgeList = null;


/**
 * The location of the point for this star in Geometry i Areas
 *
 * @private
 */
jsts.geomgraph.EdgeEndStar.prototype.ptInAreaLocation = null;


/**
 * Insert a EdgeEnd into this EdgeEndStar
 */
jsts.geomgraph.EdgeEndStar.prototype.insert = function(e) {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * Insert an EdgeEnd into the map, and clear the edgeList cache, since the list
 * of edges has now changed
 *
 * @protected
 */
jsts.geomgraph.EdgeEndStar.prototype.insertEdgeEnd = function(e, obj) {
  this.edgeMap[e] = obj;
  this.edgeList = null; // edge list has changed - clear the cache
};


/**
 * @return the coordinate for the node this star is based at.
 */
jsts.geomgraph.EdgeEndStar.prototype.getCoordinate = function() {
  this.getEdges();
  if (this.edgeList.length === 0)
    return null;
  var e = this.edgeList[0];
  return e.getCoordinate();
};
jsts.geomgraph.EdgeEndStar.prototype.getDegree = function() {
  this.getEdges();
  return this.edgeList.length;
};


/**
 * Iterator access to the ordered list of edges is optimized by copying the map
 * collection to a list. (This assumes that once an iterator is requested, it is
 * likely that insertion into the map is complete).
 *
 * NOTE: jsts does not support iterators
 */
jsts.geomgraph.EdgeEndStar.prototype.getEdges = function() {
  //if (this.edgeList == null) {
  this.edgeList = [];
  for (var key in this.edgeMap) {
    if (this.edgeMap.hasOwnProperty(key)) {
      this.edgeList.push(this.edgeMap[key]);
    }
  }

  var compare = function(a,b) {
    return a.compareTo(b);
  };
  this.edgeList.sort(compare);
  //}
  return this.edgeList;
};

jsts.geomgraph.EdgeEndStar.prototype.getNextCW = function(ee) {
  this.getEdges();
  var i = this.edgeList.indexOf(ee);
  var iNextCW = i - 1;
  if (i === 0)
    iNextCW = this.edgeList.length - 1;
  return this.edgeList[iNextCW];
};

jsts.geomgraph.EdgeEndStar.prototype.computeLabelling = function(geomGraph) {
  this.computeEdgeEndLabels(geomGraph[0].getBoundaryNodeRule());
  this.propagateSideLabels(0);
  this.propagateSideLabels(1);

  /**
   * If there are edges that still have null labels for a geometry this must be
   * because there are no area edges for that geometry incident on this node. In
   * this case, to label the edge for that geometry we must test whether the
   * edge is in the interior of the geometry. To do this it suffices to
   * determine whether the node for the edge is in the interior of an area. If
   * so, the edge has location INTERIOR for the geometry. In all other cases
   * (e.g. the node is on a line, on a point, or not on the geometry at all) the
   * edge has the location EXTERIOR for the geometry.
   * <p>
   * Note that the edge cannot be on the BOUNDARY of the geometry, since then
   * there would have been a parallel edge from the Geometry at this node also
   * labelled BOUNDARY and this edge would have been labelled in the previous
   * step.
   * <p>
   * This code causes a problem when dimensional collapses are present, since it
   * may try and determine the location of a node where a dimensional collapse
   * has occurred. The point should be considered to be on the EXTERIOR of the
   * polygon, but locate() will return INTERIOR, since it is passed the original
   * Geometry, not the collapsed version.
   *
   * If there are incident edges which are Line edges labelled BOUNDARY, then
   * they must be edges resulting from dimensional collapses. In this case the
   * other edges can be labelled EXTERIOR for this Geometry.
   *
   * MD 8/11/01 - NOT TRUE! The collapsed edges may in fact be in the interior
   * of the Geometry, which means the other edges should be labelled INTERIOR
   * for this Geometry. Not sure how solve this... Possibly labelling needs to
   * be split into several phases: area label propagation, symLabel merging,
   * then finally null label resolution.
   */
  var hasDimensionalCollapseEdge = [false, false];
  this.getEdges();
  for (var i = 0; i < this.edgeList.length; i++) {
    var e = this.edgeList[i];
    var label = e.getLabel();
    for (var geomi = 0; geomi < 2; geomi++) {
      if (label.isLine(geomi) && label.getLocation(geomi) === jsts.geom.Location.BOUNDARY)
        hasDimensionalCollapseEdge[geomi] = true;
    }
  }
  for (var i = 0; i < this.edgeList.length; i++) {
    var e = this.edgeList[i];
    var label = e.getLabel();
    for (var geomi = 0; geomi < 2; geomi++) {
      if (label.isAnyNull(geomi)) {
        var loc = jsts.geom.Location.NONE;
        if (hasDimensionalCollapseEdge[geomi]) {
          loc = jsts.geom.Location.EXTERIOR;
        } else {
          var p = e.getCoordinate();
          loc = this.getLocation(geomi, p, geomGraph);
        }
        label.setAllLocationsIfNull(geomi, loc);
      }
    }
  }
};


/**
 * @private
 */
jsts.geomgraph.EdgeEndStar.prototype.computeEdgeEndLabels = function(
    boundaryNodeRule) {
  // Compute edge label for each EdgeEnd
  this.getEdges();
  for (var i = 0; i < this.edgeList.length; i++) {
    var ee = this.edgeList[i];
    ee.computeLabel(boundaryNodeRule);
  }
};


/**
 * @private
 */
jsts.geomgraph.EdgeEndStar.prototype.getLocation = function(geomIndex, p, geom) {
  // compute location only on demand
  if (this.ptInAreaLocation[geomIndex] === jsts.geom.Location.NONE) {
    this.ptInAreaLocation[geomIndex] = jsts.algorithm.locate.SimplePointInAreaLocator.locate(p,
        geom[geomIndex].getGeometry());
  }
  return this.ptInAreaLocation[geomIndex];
};

jsts.geomgraph.EdgeEndStar.prototype.isAreaLabelsConsistent = function(
    geomGraph) {
  this.computeEdgeEndLabels(geomGraph.getBoundaryNodeRule());
  return this.checkAreaLabelsConsistent(0);
};


/**
 * @private
 */
jsts.geomgraph.EdgeEndStar.prototype.checkAreaLabelsConsistent = function(
    geomIndex) {
  // Since edges are stored in CCW order around the node,
  // As we move around the ring we move from the right to the left side of the
  // edge
  this.getEdges();
  // if no edges, trivially consistent
  if (this.edgeList.length <= 0)
    return true;
  // initialize startLoc to location of last L side (if any)
  var lastEdgeIndex = this.edgeList.edges.length - 1;
  var startLabel = this.edgeList[lastEdgeIndex].getLabel();
  var startLoc = startLabel.getLocation(geomIndex, jsts.geomgraph.Position.LEFT);

  // TODO: Assert.isTrue(startLoc != Location.NONE, 'Found unlabelled area
  // edge');

  var currLoc = startLoc;
  for (var i = 0; i < this.edgeList.length; i++) {
    var e = this.edgeList[i];
    var label = e.getLabel();
    // we assume that we are only checking a area
    // TODO: Assert.isTrue(label.isArea(geomIndex), 'Found non-area edge');
    var leftLoc = label.getLocation(geomIndex, jsts.geomgraph.Position.LEFT);
    var rightLoc = label.getLocation(geomIndex, jsts.geomgraph.Position.RIGHT);
    // check that edge is really a boundary between inside and outside!
    if (leftLoc === rightLoc) {
      return false;
    }
    // check side location conflict
    // Assert.isTrue(rightLoc == currLoc, "side location conflict " + locStr);
    if (rightLoc !== currLoc) {
      return false;
    }
    currLoc = leftLoc;
  }
  return true;
};


/**
 * @private
 */
jsts.geomgraph.EdgeEndStar.prototype.propagateSideLabels = function(geomIndex) {
  // Since edges are stored in CCW order around the node,
  // As we move around the ring we move from the right to the left side of the
  // edge
  var startLoc = jsts.geom.Location.NONE;

  // initialize loc to location of last L side (if any)
  // System.out.println("finding start location");
  this.getEdges();
  for (var i = 0; i < this.edgeList.length; i++) {
    var e = this.edgeList[i];
    var label = e.getLabel();
    if (label.isArea(geomIndex) &&
        label.getLocation(geomIndex, jsts.geomgraph.Position.LEFT) !== jsts.geom.Location.NONE)
      startLoc = label.getLocation(geomIndex, jsts.geomgraph.Position.LEFT);
  }

  // no labelled sides found, so no labels to propagate
  if (startLoc === jsts.geom.Location.NONE)
    return;

  var currLoc = startLoc;
  this.getEdges();
  for (var i = 0; i < this.edgeList.length; i++) {
    var e = this.edgeList[i];
    var label = e.getLabel();
    // set null ON values to be in current location
    if (label.getLocation(geomIndex, jsts.geomgraph.Position.ON) === jsts.geom.Location.NONE)
      label.setLocation(geomIndex, jsts.geomgraph.Position.ON, currLoc);
    // set side labels (if any)
    if (label.isArea(geomIndex)) {
      var leftLoc = label.getLocation(geomIndex, jsts.geomgraph.Position.LEFT);
      var rightLoc = label
          .getLocation(geomIndex, jsts.geomgraph.Position.RIGHT);
      // if there is a right location, that is the next location to propagate
      if (rightLoc !== jsts.geom.Location.NONE) {
        if (rightLoc !== currLoc)
          throw new jsts.error.TopologyError('side location conflict', e
              .getCoordinate());
        if (leftLoc === jsts.geom.Location.NONE) {
          // TODO: Assert.shouldNeverReachHere('found single null side (at ' +
          // e.getCoordinate() + ')');
        }
        currLoc = leftLoc;
      } else {
        /**
         * RHS is null - LHS must be null too. This must be an edge from the
         * other geometry, which has no location labelling for this geometry.
         * This edge must lie wholly inside or outside the other geometry (which
         * is determined by the current location). Assign both sides to be the
         * current location.
         */
        // TODO: Assert.isTrue(label.getLocation(geomIndex, Position.LEFT) ==
        // Location.NONE, 'found single null side');
        label.setLocation(geomIndex, jsts.geomgraph.Position.RIGHT, currLoc);
        label.setLocation(geomIndex, jsts.geomgraph.Position.LEFT, currLoc);
      }
    }
  }
};

jsts.geomgraph.EdgeEndStar.prototype.findIndex = function(eSearch) {
  this.getEdges(); // force edgelist to be computed
  for (var i = 0; i < this.edgeList.length; i++) {
    var e = this.edgeList[i];
    if (e === eSearch)
      return i;
  }
  return -1;
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * @param {Coordinate}
 *          coord
 * @param {int}
 *          segmentIndex
 * @param {double}
 *          dist
 * @constructor
 */
jsts.geomgraph.EdgeIntersection = function(coord, segmentIndex, dist) {
  this.coord = new jsts.geom.Coordinate(coord);
  this.segmentIndex = segmentIndex;
  this.dist = dist;
};


/**
 * the point of intersection
 *
 * @type {Coordinate}
 */
jsts.geomgraph.EdgeIntersection.prototype.coord = null;


/**
 * the index of the containing line segment in the parent edge
 *
 * @type {int}
 */
jsts.geomgraph.EdgeIntersection.prototype.segmentIndex = null;


/**
 * the edge distance of this point along the containing line segment
 *
 * @type {double}
 */
jsts.geomgraph.EdgeIntersection.prototype.dist = null;


/**
 * @return {Coordinate}
 */
jsts.geomgraph.EdgeIntersection.prototype.getCoordinate = function() {
  return this.coord;
};


/**
 * @return {int}
 */
jsts.geomgraph.EdgeIntersection.prototype.getSegmentIndex = function() {
  return this.segmentIndex;
};


/**
 * @return {double}
 */
jsts.geomgraph.EdgeIntersection.prototype.getDistance = function() {
  return this.dist;
};


/**
 * @param {EdgeIntersection}
 *          other
 * @return {int}
 */
jsts.geomgraph.EdgeIntersection.prototype.compareTo = function(other) {
  return this.compare(other.segmentIndex, other.dist);
};


/**
 * @param {int}
 *          segmentIndex
 * @param {double}
 *          dist
 * @return {int} -1 this EdgeIntersection is located before the argument
 *         location.
 * @return {int} 0 this EdgeIntersection is at the argument location.
 * @return {int} 1 this EdgeIntersection is located after the argument location.
 */
jsts.geomgraph.EdgeIntersection.prototype.compare = function(segmentIndex, dist) {
  if (this.segmentIndex < segmentIndex)
    return -1;
  if (this.segmentIndex > segmentIndex)
    return 1;
  if (this.dist < dist)
    return -1;
  if (this.dist > dist)
    return 1;
  return 0;
};


/**
 * @param {int}
 *          maxSegmentIndex
 * @return {boolean}
 */
jsts.geomgraph.EdgeIntersection.prototype.isEndPoint = function(maxSegmentIndex) {
  if (this.segmentIndex === 0 && this.dist === 0.0)
    return true;
  if (this.segmentIndex === maxSegmentIndex)
    return true;
  return false;
};

jsts.geomgraph.EdgeIntersection.prototype.toString = function() {
  return '' + this.segmentIndex + this.dist;
};


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * @constructor
 */
jsts.geomgraph.EdgeIntersectionList = function(edge) {
  this.nodeMap = {};
  this.edge = edge;
};


/**
 * NOTE: In In JSTS a JS object replaces TreeMap. Sorting is done when needed.
 */
jsts.geomgraph.EdgeIntersectionList.prototype.nodeMap = null;


/**
 * the parent edge
 * @type {Edge}
 */
jsts.geomgraph.EdgeIntersectionList.prototype.edge = null;


/**
 * Adds an intersection into the list, if it isn't already there.
 * The input segmentIndex and dist are expected to be normalized.
 * @param {Coordinate} intPt
 * @param {int} segmentIndex
 * @param {double} dist
 * @return {EdgeIntersection} the EdgeIntersection found or added.
 */
jsts.geomgraph.EdgeIntersectionList.prototype.add = function(intPt, segmentIndex, dist)    {
  var eiNew = new jsts.geomgraph.EdgeIntersection(intPt, segmentIndex, dist);
  var ei = this.nodeMap[eiNew];
  if (ei !== undefined) {
    return ei;
  }
  this.nodeMap[eiNew] = eiNew;
  return eiNew;
};


/**
 * Adds entries for the first and last points of the edge to the list
 */
jsts.geomgraph.EdgeIntersectionList.prototype.addEndpoints = function()    {
  var maxSegIndex = this.edge.pts.length - 1;
  this.add(this.edge.pts[0], 0, 0.0);
  this.add(this.edge.pts[maxSegIndex], maxSegIndex, 0.0);
};


/**
 * NOTE: replaces iterator in JTS
 */
jsts.geomgraph.EdgeIntersectionList.prototype.getSortedIntersections = function() {
  var array = [];
  for (var key in this.nodeMap) {
    if (this.nodeMap.hasOwnProperty(key)) {
      array.push(this.nodeMap[key]);
    }
  }

  var compare = function(a,b) {
    return a.compareTo(b);
  };
  array.sort(compare);

  return array;
};

// TODO: port rest

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geomgraph/NodeMap.js
 * @requires jsts/geomgraph/NodeFactory.js
 */



/**
 * The computation of the <code>IntersectionMatrix</code> relies on the use of
 * a structure called a "topology graph". The topology graph contains nodes and
 * edges corresponding to the nodes and line segments of a <code>Geometry</code>.
 * Each node and edge in the graph is labeled with its topological location
 * relative to the source geometry.
 * <P>
 * Note that there is no requirement that points of self-intersection be a
 * vertex. Thus to obtain a correct topology graph, <code>Geometry</code>s
 * must be self-noded before constructing their graphs.
 * <P>
 * Two fundamental operations are supported by topology graphs:
 * <UL>
 * <LI>Computing the intersections between all the edges and nodes of a single
 * graph
 * <LI>Computing the intersections between the edges and nodes of two different
 * graphs
 * </UL>
 *
 * @constructor
 */
jsts.geomgraph.PlanarGraph = function(nodeFactory) {
  this.edges = [];
  this.nodes = new jsts.geomgraph.NodeMap(nodeFactory || new jsts.geomgraph.NodeFactory());
};


/**
 * @protected
 */
jsts.geomgraph.PlanarGraph.prototype.edges = null;


/**
 * @type {jsts.geomgraph.NodeMap}
 */
jsts.geomgraph.PlanarGraph.prototype.nodes = null;

jsts.geomgraph.PlanarGraph.prototype.isBoundaryNode = function(geomIndex, coord) {
  var node = this.nodes.find(coord);
  if (node == null) return false;
  var label = node.getLabel();
  if (label !== null && label.getLocation(geomIndex) === jsts.geom.Location.BOUNDARY) return true;
  return false;
};

jsts.geomgraph.PlanarGraph.prototype.insertEdge = function(e) {
  this.edges.push(e);
};

jsts.geomgraph.PlanarGraph.prototype.getEdges = function() {
  return this.edges;
};

jsts.geomgraph.PlanarGraph.prototype.getNodes = function() {
  return this.nodes.values();
};

// TODO: port rest of class

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geomgraph/PlanarGraph.js
 */


/**
 * A GeometryGraph is a graph that models a given Geometry
 *
 * @param {int}
 *          argIndex
 * @param {Geometry}
 *          parentGeom
 * @param {BoundaryNodeRule}
 *          boundaryNodeRule
 * @augments jsts.planargraph.PlanarGraph
 */
jsts.geomgraph.GeometryGraph = function(argIndex, parentGeom, boundaryNodeRule) {
  jsts.geomgraph.PlanarGraph.call(this);

  this.lineEdgeMap = {};

  this.ptLocator = new jsts.algorithm.PointLocator();

  this.argIndex = argIndex;
  this.parentGeom = parentGeom;
  this.boundaryNodeRule = boundaryNodeRule ||
      jsts.algorithm.BoundaryNodeRule.OGC_SFS_BOUNDARY_RULE;
  if (parentGeom != null) {
    this.add(parentGeom);
  }
};

jsts.geomgraph.GeometryGraph.prototype = new jsts.geomgraph.PlanarGraph();


/**
 * @param {BoundaryNodeRule}
 *          boundaryNodeRule
 * @param {int}
 *          boundaryCount
 * @return {int}
 */
jsts.geomgraph.GeometryGraph.determineBoundary = function(boundaryNodeRule,
    boundaryCount) {
  return boundaryNodeRule.isInBoundary(boundaryCount) ? jsts.geom.Location.BOUNDARY
      : jsts.geom.Location.INTERIOR;
};


/**
 * @type {Geometry}
 */
jsts.geomgraph.GeometryGraph.prototype.parentGeom = null;


/**
 * The lineEdgeMap is a map of the linestring components of the parentGeometry
 * to the edges which are derived from them. This is used to efficiently perform
 * findEdge queries
 *
 * NOTE: In JSTS a JS object replaces HashMap.
 *
 * @type {Object}
 * @private
 */
jsts.geomgraph.GeometryGraph.prototype.lineEdgeMap = null;


/**
 * @type {BoundaryNodeRule}
 */
jsts.geomgraph.GeometryGraph.prototype.boundaryNodeRule = null;


/**
 * If this flag is true, the Boundary Determination Rule will used when deciding
 * whether nodes are in the boundary or not
 */
/**
 * @type {boolean}
 * @private
 */
jsts.geomgraph.GeometryGraph.prototype.useBoundaryDeterminationRule = true;


/**
 * the index of this geometry as an argument to a spatial function (used for
 * labelling)
 *
 * @type {int}
 * @private
 */
jsts.geomgraph.GeometryGraph.prototype.argIndex = null; //


/**
 * @type {Collection}
 * @private
 */
jsts.geomgraph.GeometryGraph.prototype.boundaryNodes = null;


/**
 * @type {Coordinate}
 * @private
 */
jsts.geomgraph.GeometryGraph.prototype.hasTooFewPoints = false;


/**
 * @type {Coordinate}
 * @private
 */
jsts.geomgraph.GeometryGraph.prototype.invalidPoint = null;


/**
 * @type {PointOnGeometryLocator}
 * @private
 */
jsts.geomgraph.GeometryGraph.prototype.areaPtLocator = null;


/**
 * for use if geometry is not Polygonal
 *
 * @type {PointLocator}
 * @private
 */
jsts.geomgraph.GeometryGraph.prototype.ptLocator = null;


jsts.geomgraph.GeometryGraph.prototype.getGeometry = function() {
  return this.parentGeom;
};

jsts.geomgraph.GeometryGraph.prototype.getBoundaryNodes = function() {
  if (this.boundaryNodes == null)
    this.boundaryNodes = this.nodes.getBoundaryNodes(this.argIndex);
  return this.boundaryNodes;
};

jsts.geomgraph.GeometryGraph.prototype.getBoundaryNodeRule = function() {
  return this.boundaryNodeRule;
};


/**
 * @return {EdgeSetIntersector}
 * @private
 */
jsts.geomgraph.GeometryGraph.prototype.createEdgeSetIntersector = function() {
  return new jsts.geomgraph.index.SimpleEdgeSetIntersector();
  // TODO: use optimized version when ported
  // return new jsts.geomgraph.index.SimpleMCSweepLineIntersector();
};


/**
 * @param {Geometry}
 *          g
 */
jsts.geomgraph.GeometryGraph.prototype.add = function(g) {
  if (g.isEmpty()) {
    return;
  }

  // check if this Geometry should obey the Boundary Determination Rule
  // all collections except MultiPolygons obey the rule
  if (g instanceof jsts.geom.MultiPolygon)
    this.useBoundaryDeterminationRule = false;

  if (g instanceof jsts.geom.Polygon)
    this.addPolygon(g);
  // LineString also handles LinearRings
  else if (g instanceof jsts.geom.LineString)
    this.addLineString(g);
  else if (g instanceof jsts.geom.Point)
    this.addPoint(g);
  else if (g instanceof jsts.geom.MultiPoint)
    this.addCollection(g);
  else if (g instanceof jsts.geom.MultiLineString)
    this.addCollection(g);
  else if (g instanceof jsts.geom.MultiPolygon)
    this.addCollection(g);
  else if (g instanceof jsts.geom.GeometryCollection)
    this.addCollection(g);
  else
    throw new jsts.error.IllegalArgumentError('Geometry type not supported.');
};


/**
 * @private
 */
jsts.geomgraph.GeometryGraph.prototype.addCollection = function(gc) {
  for (var i = 0; i < gc.getNumGeometries(); i++) {
    var g = gc.getGeometryN(i);
    this.add(g);
  }
};


/**
 * Add an Edge computed externally. The label on the Edge is assumed to be
 * correct.
 */
jsts.geomgraph.GeometryGraph.prototype.addEdge = function(e) {
  this.insertEdge(e);
  var coord = e.getCoordinates();
  // insert the endpoint as a node, to mark that it is on the boundary
  this.insertPoint(this.argIndex, coord[0], jsts.geom.Location.BOUNDARY);
  this.insertPoint(this.argIndex, coord[coord.length - 1],
      jsts.geom.Location.BOUNDARY);
};


/**
 * Add a Point to the graph.
 */
jsts.geomgraph.GeometryGraph.prototype.addPoint = function(p) {
  var coord = p.getCoordinate();
  this.insertPoint(this.argIndex, coord, jsts.geom.Location.INTERIOR);
};


/**
 * @param {LineString}
 *          line
 * @private
 */
jsts.geomgraph.GeometryGraph.prototype.addLineString = function(line) {
  var coords = jsts.geom.CoordinateArrays.removeRepeatedPoints(line
      .getCoordinates());

  if (coords.length < 2) {
    this.hasTooFewPoints = true;
    this.invalidPoint = coords[0];
    return;
  }

  // add the edge for the LineString
  // line edges do not have locations for their left and right sides
  var e = new jsts.geomgraph.Edge(coords, new jsts.geomgraph.Label(
      this.argIndex, jsts.geom.Location.INTERIOR));
  this.lineEdgeMap[line] = e;
  this.insertEdge(e);
  /**
   * Add the boundary points of the LineString, if any. Even if the LineString
   * is closed, add both points as if they were endpoints. This allows for the
   * case that the node already exists and is a boundary point.
   */
  if (coords.length >= 2 === false) {
    throw new jsts.error.IllegalArgumentError(
        'found LineString with single point');
  }

  this.insertBoundaryPoint(this.argIndex, coords[0]);
  this.insertBoundaryPoint(this.argIndex, coords[coords.length - 1]);
};


/**
 * Adds a polygon ring to the graph. Empty rings are ignored.
 *
 * The left and right topological location arguments assume that the ring is
 * oriented CW. If the ring is in the opposite orientation, the left and right
 * locations must be interchanged.
 *
 * @private
 */
jsts.geomgraph.GeometryGraph.prototype.addPolygonRing = function(lr, cwLeft,
    cwRight) {
  // don't bother adding empty holes
  if (lr.isEmpty())
    return;

  var coord = jsts.geom.CoordinateArrays.removeRepeatedPoints(lr
      .getCoordinates());

  if (coord.length < 4) {
    this.hasTooFewPoints = true;
    this.invalidPoint = coord[0];
    return;
  }

  var left = cwLeft;
  var right = cwRight;
  if (jsts.algorithm.CGAlgorithms.isCCW(coord)) {
    left = cwRight;
    right = cwLeft;
  }
  var e = new jsts.geomgraph.Edge(coord, new jsts.geomgraph.Label(
      this.argIndex, jsts.geom.Location.BOUNDARY, left, right));
  this.lineEdgeMap[lr] = e;

  this.insertEdge(e);
  // insert the endpoint as a node, to mark that it is on the boundary
  this.insertPoint(this.argIndex, coord[0], jsts.geom.Location.BOUNDARY);
};


/**
 * @private
 */
jsts.geomgraph.GeometryGraph.prototype.addPolygon = function(p) {
  this.addPolygonRing(p.getExteriorRing(), jsts.geom.Location.EXTERIOR,
      jsts.geom.Location.INTERIOR);

  for (var i = 0; i < p.getNumInteriorRing(); i++) {
    var hole = p.getInteriorRingN(i);

    // Holes are topologically labelled opposite to the shell, since
    // the interior of the polygon lies on their opposite side
    // (on the left, if the hole is oriented CW)
    this.addPolygonRing(hole, jsts.geom.Location.INTERIOR,
        jsts.geom.Location.EXTERIOR);
  }
};


jsts.geomgraph.GeometryGraph.prototype.computeEdgeIntersections = function(g,
    li, includeProper) {
  var si = new jsts.geomgraph.index.SegmentIntersector(li, includeProper, true);
  si.setBoundaryNodes(this.getBoundaryNodes(), g.getBoundaryNodes());

  var esi = this.createEdgeSetIntersector();
  esi.computeIntersections(this.edges, g.edges, si);

  return si;
};


/**
 * Compute self-nodes, taking advantage of the Geometry type to minimize the
 * number of intersection tests. (E.g. rings are not tested for
 * self-intersection, since they are assumed to be valid).
 *
 * @param {LineIntersector}
 *          li the LineIntersector to use.
 * @param {boolean}
 *          computeRingSelfNodes if <false>, intersection checks are optimized
 *          to not test rings for self-intersection.
 * @return {SegmentIntersector} the SegmentIntersector used, containing
 *         information about the intersections found.
 */
jsts.geomgraph.GeometryGraph.prototype.computeSelfNodes = function(li,
    computeRingSelfNodes) {
  var si = new jsts.geomgraph.index.SegmentIntersector(li, true, false);
  var esi = this.createEdgeSetIntersector();
  // optimized test for Polygons and Rings
  if (!computeRingSelfNodes &&
      (this.parentGeom instanceof jsts.geom.LinearRing ||
          this.parentGeom instanceof jsts.geom.Polygon || this.parentGeom instanceof jsts.geom.MultiPolygon)) {
    esi.computeIntersections(this.edges, si, false);
  } else {
    esi.computeIntersections(this.edges, si, true);
  }
  this.addSelfIntersectionNodes(this.argIndex);
  return si;
};


/**
 * @private
 */
jsts.geomgraph.GeometryGraph.prototype.insertPoint = function(argIndex, coord,
    onLocation) {
  var n = this.nodes.addNode(coord);
  var lbl = n.getLabel();
  if (lbl == null) {
    n.label = new jsts.geomgraph.Label(argIndex, onLocation);
  } else
    lbl.setLocation(argIndex, onLocation);
};


/**
 * Adds candidate boundary points using the current {@link BoundaryNodeRule}.
 * This is used to add the boundary points of dim-1 geometries
 * (Curves/MultiCurves).
 */
jsts.geomgraph.GeometryGraph.prototype.insertBoundaryPoint = function(argIndex,
    coord) {

  var n = this.nodes.addNode(coord);
  var lbl = n.getLabel();
  // the new point to insert is on a boundary
  var boundaryCount = 1;
  // determine the current location for the point (if any)
  var loc = jsts.geom.Location.NONE;
  if (lbl !== null)
    loc = lbl.getLocation(argIndex, jsts.geomgraph.Position.ON);
  if (loc === jsts.geom.Location.BOUNDARY)
    boundaryCount++;

  // determine the boundary status of the point according to the Boundary
  // Determination Rule
  var newLoc = jsts.geomgraph.GeometryGraph.determineBoundary(
      this.boundaryNodeRule, boundaryCount);
  lbl.setLocation(argIndex, newLoc);
};

jsts.geomgraph.GeometryGraph.prototype.addSelfIntersectionNodes = function(
    argIndex) {
  var i, e, eLoc, j, ei;
  for (i = 0; i < this.edges.length; i++) {
    e = this.edges[i];
    eLoc = e.getLabel().getLocation(argIndex);
    var eis = e.eiList.getSortedIntersections();
    for (j = 0; j < eis.length; j++) {
      ei = eis[j];
      this.addSelfIntersectionNode(argIndex, ei.coord, eLoc);
    }
  }
};


/**
 * Add a node for a self-intersection. If the node is a potential boundary node
 * (e.g. came from an edge which is a boundary) then insert it as a potential
 * boundary node. Otherwise, just add it as a regular node.
 */
jsts.geomgraph.GeometryGraph.prototype.addSelfIntersectionNode = function(
    argIndex, coord, loc) {
  // if this node is already a boundary node, don't change it
  if (this.isBoundaryNode(argIndex, coord))
    return;
  if (loc === jsts.geom.Location.BOUNDARY && this.useBoundaryDeterminationRule)
    this.insertBoundaryPoint(argIndex, coord);
  else
    this.insertPoint(argIndex, coord, loc);
};

// TODO: port rest of class

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * A <code>Label</code> indicates the topological relationship of a component
 * of a topology graph to a given <code>Geometry</code>. This class supports
 * labels for relationships to two <code>Geometry</code>s, which is
 * sufficient for algorithms for binary operations.
 * <P>
 * Topology graphs support the concept of labeling nodes and edges in the graph.
 * The label of a node or edge specifies its topological relationship to one or
 * more geometries. (In fact, since JTS operations have only two arguments
 * labels are required for only two geometries). A label for a node or edge has
 * one or two elements, depending on whether the node or edge occurs in one or
 * both of the input <code>Geometry</code>s. Elements contain attributes
 * which categorize the topological location of the node or edge relative to the
 * parent <code>Geometry</code>; that is, whether the node or edge is in the
 * interior, boundary or exterior of the <code>Geometry</code>. Attributes
 * have a value from the set <code>{Interior, Boundary, Exterior}</code>. In
 * a node each element has a single attribute <code>&lt;On&gt;</code>. For an
 * edge each element has a triplet of attributes
 * <code>&lt;Left, On, Right&gt;</code>.
 * <P>
 * It is up to the client code to associate the 0 and 1
 * <code>TopologyLocation</code>s with specific geometries.
 *
 * @constructor
 */
jsts.geomgraph.Label = function() {
  this.elt = [];

  var geomIndex, onLoc, leftLoc, lbl, rightLoc;
  if (arguments.length === 4) {
    geomIndex = arguments[0];
    onLoc = arguments[1];
    leftLoc = arguments[2];
    rightLoc = arguments[3];
    this.elt[0] = new jsts.geomgraph.TopologyLocation(jsts.geom.Location.NONE,
        jsts.geom.Location.NONE, jsts.geom.Location.NONE);
    this.elt[1] = new jsts.geomgraph.TopologyLocation(jsts.geom.Location.NONE,
        jsts.geom.Location.NONE, jsts.geom.Location.NONE);
    this.elt[geomIndex].setLocations(onLoc, leftLoc, rightLoc);
  } else if (arguments.length === 3) {
    onLoc = arguments[0];
    leftLoc = arguments[1];
    rightLoc = arguments[2];
    this.elt[0] = new jsts.geomgraph.TopologyLocation(onLoc, leftLoc, rightLoc);
    this.elt[1] = new jsts.geomgraph.TopologyLocation(onLoc, leftLoc, rightLoc);
  } else if (arguments.length === 2) {
    geomIndex = arguments[0];
    onLoc = arguments[1];
    this.elt[0] = new jsts.geomgraph.TopologyLocation(jsts.geom.Location.NONE);
    this.elt[1] = new jsts.geomgraph.TopologyLocation(jsts.geom.Location.NONE);
    this.elt[geomIndex].setLocation(onLoc);
  } else if (arguments[0] instanceof jsts.geomgraph.Label) {
    lbl = arguments[0];
    this.elt[0] = new jsts.geomgraph.TopologyLocation(lbl.elt[0]);
    this.elt[1] = new jsts.geomgraph.TopologyLocation(lbl.elt[1]);
  } else if (typeof arguments[0] === 'number') {
    onLoc = arguments[0];
    this.elt[0] = new jsts.geomgraph.TopologyLocation(onLoc);
    this.elt[1] = new jsts.geomgraph.TopologyLocation(onLoc);
  }
};


/**
 * converts a Label to a Line label (that is, one with no side Locations)
 *
 * @param {label}
 *          label
 * @return {Label}
 */
jsts.geomgraph.Label.toLineLabel = function(label) {
  var i, lineLabel = new jsts.geomgraph.Label(jsts.geom.Location.NONE);
  for (i = 0; i < 2; i++) {
    lineLabel.setLocation(i, label.getLocation(i));
  }
  return lineLabel;
};


/**
 * @type {TopologyLocation[]}
 * @private
 */
jsts.geomgraph.Label.prototype.elt = null;

jsts.geomgraph.Label.prototype.flip = function() {
  this.elt[0].flip();
  this.elt[1].flip();
};


/**
 * @param {int}
 *          geomIndex
 * @param {int}
 *          posIndex
 * @return {int}
 */
jsts.geomgraph.Label.prototype.getLocation = function(geomIndex, posIndex) {
  if (arguments.length == 1) {
    return this.getLocation2.apply(this, arguments);
  }
  return this.elt[geomIndex].get(posIndex);
};


/**
 * @param {int}
 *          geomIndex
 * @return {int}
 */
jsts.geomgraph.Label.prototype.getLocation2 = function(geomIndex) {
  return this.elt[geomIndex].get(jsts.geomgraph.Position.ON);
};


/**
 * @param {int}
 *          geomIndex
 * @param {int}
 *          posIndex
 * @param {int}
 *          location
 */
jsts.geomgraph.Label.prototype.setLocation = function(geomIndex, posIndex,
    location) {
  if (arguments.length == 2) {
    this.setLocation2.apply(this, arguments);
    return;
  }

  this.elt[geomIndex].setLocation(posIndex, location);
};


/**
 * @param {int}
 *          geomIndex
 * @param {int}
 *          location
 */
jsts.geomgraph.Label.prototype.setLocation2 = function(geomIndex, location) {
  this.elt[geomIndex].setLocation(jsts.geomgraph.Position.ON, location);
};


/**
 * @param {int}
 *          geomIndex
 * @param {int}
 *          location
 */
jsts.geomgraph.Label.prototype.setAllLocations = function(geomIndex, location) {
  this.elt[geomIndex].setAllLocations(location);
};


/**
 * @param {int}
 *          geomIndex
 * @param {int}
 *          location
 */
jsts.geomgraph.Label.prototype.setAllLocationsIfNull = function(geomIndex,
    location) {
  if (arguments.length == 1) {
    this.setAllLocationsIfNull2.apply(this, arguments);
    return;
  }

  this.elt[geomIndex].setAllLocationsIfNull(location);
};


/**
 * @param {int}
 *          location
 */
jsts.geomgraph.Label.prototype.setAllLocationsIfNull2 = function(location) {
  this.setAllLocationsIfNull(0, location);
  this.setAllLocationsIfNull(1, location);
};


/**
 * Merge this label with another one. Merging updates any null attributes of
 * this label with the attributes from lbl
 *
 * @param {Label}
 *          lbl
 */
jsts.geomgraph.Label.prototype.merge = function(lbl) {
  var i;
  for (i = 0; i < 2; i++) {
    if (this.elt[i] === null && lbl.elt[i] !== null) {
      this.elt[i] = new jsts.geomgraph.TopologyLocation(lbl.elt[i]);
    } else {
      this.elt[i].merge(lbl.elt[i]);
    }
  }
};


/**
 * @return {int}
 */
jsts.geomgraph.Label.prototype.getGeometryCount = function() {
  var count = 0;
  if (!this.elt[0].isNull()) {
    count++;
  }
  if (!this.elt[1].isNull()) {
    count++;
  }
  return count;
};


/**
 * @param {int}
 *          geomIndex
 * @return {boolean}
 */
jsts.geomgraph.Label.prototype.isNull = function(geomIndex) {
  return this.elt[geomIndex].isNull();
};


/**
 * @param {int}
 *          geomIndex
 * @return {boolean}
 */
jsts.geomgraph.Label.prototype.isAnyNull = function(geomIndex) {
  return this.elt[geomIndex].isAnyNull();
};


/**
 * @return {boolean}
 */
jsts.geomgraph.Label.prototype.isArea = function() {
  if (arguments.length == 1) {
    return this.isArea2(arguments[0]);
  }

  return this.elt[0].isArea() || this.elt[1].isArea();
};


/**
 * @param {int}
 *          geomIndex
 * @return {boolean}
 */
jsts.geomgraph.Label.prototype.isArea2 = function(geomIndex) {
  return this.elt[geomIndex].isArea();
};


/**
 * @param {int}
 *          geomIndex
 * @return {boolean}
 */
jsts.geomgraph.Label.prototype.isLine = function(geomIndex) {
  return this.elt[geomIndex].isLine();
};


/**
 * @param {Label}
 *          lbl
 * @param {int}
 *          side
 * @return {boolean}
 */
jsts.geomgraph.Label.prototype.isEqualOnSide = function(lbl, side) {
  return this.elt[0].isEqualOnSide(lbl.elt[0], side) &&
      this.elt[1].isEqualOnSide(lbl.elt[1], side);
};


/**
 * @param {int}
 *          geomIndex
 * @param {int}
 *          loc
 * @return {boolean}
 */
jsts.geomgraph.Label.prototype.allPositionsEqual = function(geomIndex, loc) {
  return this.elt[geomIndex].allPositionsEqual(loc);
};


/**
 * Converts one GeometryLocation to a Line location
 *
 * @param {int}
 *          geomIndex
 */
jsts.geomgraph.Label.prototype.toLine = function(geomIndex) {
  if (this.elt[geomIndex].isArea()) {
    this.elt[geomIndex] = new jsts.geomgraph.TopologyLocation(this.elt[geomIndex].location[0]);
  }
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * A Position indicates the position of a Location relative to a graph component
 * (Node, Edge, or Area).
 *
 * @constructor
 */
jsts.geomgraph.Position = function() {

};


/**
 * An indicator that a Location is <i>on</i> a GraphComponent
 *
 * @type {int}
 */
jsts.geomgraph.Position.ON = 0;


/**
 * An indicator that a Location is to the <i>left</i> of a GraphComponent
 *
 * @type {int}
 */
jsts.geomgraph.Position.LEFT = 1;


/**
 * An indicator that a Location is to the <i>right</i> of a GraphComponent
 *
 * @type {int}
 */
jsts.geomgraph.Position.RIGHT = 2;


/**
 * Returns LEFT if the position is RIGHT, RIGHT if the position is LEFT, or the
 * position otherwise.
 *
 * @param {int}
 *          position
 * @return {int}
 */
jsts.geomgraph.Position.opposite = function(position) {
  if (position === jsts.geomgraph.Position.LEFT) {
    return jsts.geomgraph.Position.RIGHT;
  }
  if (position === jsts.geomgraph.Position.RIGHT) {
    return jsts.geomgraph.Position.LEFT;
  }
  return position;
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Utility functions for working with quadrants, which are numbered as follows:
 *
 * <pre>
 * 1 | 0
 * --+--
 * 2 | 3
 * &lt;pre&gt;
 * @constructor
 *
 */
jsts.geomgraph.Quadrant = function() {

};

jsts.geomgraph.Quadrant.NE = 0;
jsts.geomgraph.Quadrant.NW = 1;
jsts.geomgraph.Quadrant.SW = 2;
jsts.geomgraph.Quadrant.SE = 3;


/**
 * Returns the quadrant of a directed line segment (specified as x and y
 * displacements, which cannot both be 0).
 *
 * @throws IllegalArgumentException
 *           if the displacements are both 0
 */
jsts.geomgraph.Quadrant.quadrant = function(dx, dy) {
  if (dx instanceof jsts.geom.Coordinate) {
    return jsts.geomgraph.Quadrant.quadrant2.apply(this, arguments);
  }

  if (dx === 0.0 && dy === 0.0)
    throw new jsts.error.IllegalArgumentError(
        'Cannot compute the quadrant for point ( ' + dx + ', ' + dy + ' )');
  if (dx >= 0.0) {
    if (dy >= 0.0)
      return jsts.geomgraph.Quadrant.NE;
    else
      return jsts.geomgraph.Quadrant.SE;
  } else {
    if (dy >= 0.0)
      return jsts.geomgraph.Quadrant.NW;
    else
      return jsts.geomgraph.Quadrant.SW;
  }
};


/**
 * Returns the quadrant of a directed line segment from p0 to p1.
 *
 * @throws IllegalArgumentException
 *           if the points are equal
 */
jsts.geomgraph.Quadrant.quadrant2 = function(p0, p1) {
  if (p1.x === p0.x && p1.y === p0.y)
    throw new jsts.error.IllegalArgumentError(
        'Cannot compute the quadrant for two identical points ' + p0);

  if (p1.x >= p0.x) {
    if (p1.y >= p0.y)
      return jsts.geomgraph.Quadrant.NE;
    else
      return jsts.geomgraph.Quadrant.SE;
  } else {
    if (p1.y >= p0.y)
      return jsts.geomgraph.Quadrant.NW;
    else
      return jsts.geomgraph.Quadrant.SW;
  }
};


/**
 * Returns true if the quadrants are 1 and 3, or 2 and 4
 */
jsts.geomgraph.Quadrant.isOpposite = function(quad1, quad2) {
  if (quad1 === quad2)
    return false;
  var diff = (quad1 - quad2 + 4) % 4;
  // if quadrants are not adjacent, they are opposite
  if (diff === 2)
    return true;
  return false;
};


/**
 * Returns the right-hand quadrant of the halfplane defined by the two
 * quadrants, or -1 if the quadrants are opposite, or the quadrant if they are
 * identical.
 */
jsts.geomgraph.Quadrant.commonHalfPlane = function(quad1, quad2) {
  // if quadrants are the same they do not determine a unique common halfplane.
  // Simply return one of the two possibilities
  if (quad1 === quad2)
    return quad1;
  var diff = (quad1 - quad2 + 4) % 4;
  // if quadrants are not adjacent, they do not share a common halfplane
  if (diff === 2)
    return -1;
  //
  var min = (quad1 < quad2) ? quad1 : quad2;
  var max = (quad1 > quad2) ? quad1 : quad2;
  // for this one case, the righthand plane is NOT the minimum index;
  if (min === 0 && max === 3)
    return 3;
  // in general, the halfplane index is the minimum of the two adjacent
  // quadrants
  return min;
};


/**
 * Returns whether the given quadrant lies within the given halfplane (specified
 * by its right-hand quadrant).
 */
jsts.geomgraph.Quadrant.isInHalfPlane = function(quad, halfPlane) {
  if (halfPlane === jsts.geomgraph.Quadrant.SE) {
    return quad === jsts.geomgraph.Quadrant.SE ||
        quad === jsts.geomgraph.Quadrant.SW;
  }
  return quad === halfPlane || quad === halfPlane + 1;
};


/**
 * Returns true if the given quadrant is 0 or 1.
 */
jsts.geomgraph.Quadrant.isNorthern = function(quad) {
  return quad === jsts.geomgraph.Quadrant.NE ||
      quad === jsts.geomgraph.Quadrant.NW;
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * A TopologyLocation is the labelling of a GraphComponent's topological
 * relationship to a single Geometry.
 * <p>
 * If the parent component is an area edge, each side and the edge itself have a
 * topological location. These locations are named
 * <ul>
 * <li> ON: on the edge
 * <li> LEFT: left-hand side of the edge
 * <li> RIGHT: right-hand side
 * </ul>
 * If the parent component is a line edge or node, there is a single topological
 * relationship attribute, ON.
 * <p>
 * The possible values of a topological location are {Location.NONE,
 * Location.EXTERIOR, Location.BOUNDARY, Location.INTERIOR}
 * <p>
 * The labelling is stored in an array location[j] where where j has the values
 * ON, LEFT, RIGHT
 *
 * @constructor
 */
jsts.geomgraph.TopologyLocation = function() {
  this.location = [];

  if (arguments.length === 3) {
    var on = arguments[0];
    var left = arguments[1];
    var right = arguments[2];
    this.init(3);
    this.location[jsts.geomgraph.Position.ON] = on;
    this.location[jsts.geomgraph.Position.LEFT] = left;
    this.location[jsts.geomgraph.Position.RIGHT] = right;
  } else if (arguments[0] instanceof jsts.geomgraph.TopologyLocation) {
    var gl = arguments[0];
    this.init(gl.location.length);
    if (gl != null) {
      for (var i = 0; i < this.location.length; i++) {
        this.location[i] = gl.location[i];
      }
    }
  } else if (typeof arguments[0] === 'number') {
    var on = arguments[0];
    this.init(1);
    this.location[jsts.geomgraph.Position.ON] = on;
  } else if (arguments[0] instanceof Array) {
    var location = arguments[0];
    this.init(location.length);
  }
};


/**
 * @private
 */
jsts.geomgraph.TopologyLocation.prototype.location = null;


/**
 * @param {int}
 *          size
 * @private
 */
jsts.geomgraph.TopologyLocation.prototype.init = function(size) {
  this.location[size - 1] = null;
  this.setAllLocations(jsts.geom.Location.NONE);
};


/**
 * @param {int}
 *          posIndex
 * @return {int}
 */
jsts.geomgraph.TopologyLocation.prototype.get = function(posIndex) {
  if (posIndex < this.location.length)
    return this.location[posIndex];
  return jsts.geom.Location.NONE;
};


/**
 * @return {boolean} true if all locations are NULL.
 */
jsts.geomgraph.TopologyLocation.prototype.isNull = function() {
  for (var i = 0; i < this.location.length; i++) {
    if (this.location[i] !== jsts.geom.Location.NONE)
      return false;
  }
  return true;
};


/**
 * @return {boolean} true if any locations are NULL.
 */
jsts.geomgraph.TopologyLocation.prototype.isAnyNull = function() {
  for (var i = 0; i < this.location.length; i++) {
    if (this.location[i] === jsts.geom.Location.NONE)
      return true;
  }
  return false;
};


/**
 * @param {TopologyLocation}
 *          le
 * @param {int}
 *          locIndex
 * @return {boolean}
 */
jsts.geomgraph.TopologyLocation.prototype.isEqualOnSide = function(le, locIndex) {
  return this.location[locIndex] == le.location[locIndex];
};


/**
 * @return {boolean}
 */
jsts.geomgraph.TopologyLocation.prototype.isArea = function() {
  return this.location.length > 1;
};


/**
 * @return {boolean}
 */
jsts.geomgraph.TopologyLocation.prototype.isLine = function() {
  return this.location.length === 1;
};

jsts.geomgraph.TopologyLocation.prototype.flip = function() {
  if (this.location.length <= 1)
    return;
  var temp = this.location[jsts.geomgraph.Position.LEFT];
  this.location[jsts.geomgraph.Position.LEFT] = this.location[jsts.geomgraph.Position.RIGHT];
  this.location[jsts.geomgraph.Position.RIGHT] = temp;
};


/**
 * @param {int}
 *          locValue
 */
jsts.geomgraph.TopologyLocation.prototype.setAllLocations = function(locValue) {
  for (var i = 0; i < this.location.length; i++) {
    this.location[i] = locValue;
  }
};


/**
 * @param {int}
 *          locValue
 */
jsts.geomgraph.TopologyLocation.prototype.setAllLocationsIfNull = function(
    locValue) {
  for (var i = 0; i < this.location.length; i++) {
    if (this.location[i] === jsts.geom.Location.NONE)
      this.location[i] = locValue;
  }
};


/**
 * @param {int}
 *          locIndex
 * @param {int}
 *          locValue
 */
jsts.geomgraph.TopologyLocation.prototype.setLocation = function(locIndex,
    locValue) {
  if (locValue !== undefined) {
    this.location[locIndex] = locValue;
  } else {
    this.setLocation(jsts.geomgraph.Position.ON, locIndex);
  }
};


/**
 * @return {int[]}
 */
jsts.geomgraph.TopologyLocation.prototype.getLocations = function() {
  return location;
};


/**
 * @param {int}
 *          on
 * @param {int}
 *          left
 * @param {int}
 *          right
 */
jsts.geomgraph.TopologyLocation.prototype.setLocations = function(on, left,
    right) {
  this.location[jsts.geomgraph.Position.ON] = on;
  this.location[jsts.geomgraph.Position.LEFT] = left;
  this.location[jsts.geomgraph.Position.RIGHT] = right;
};


/**
 * @param {int}
 *          loc
 * @return {boolean}
 */
jsts.geomgraph.TopologyLocation.prototype.allPositionsEqual = function(loc) {
  for (var i = 0; i < this.location.length; i++) {
    if (this.location[i] !== loc)
      return false;
  }
  return true;
};


/**
 * merge updates only the NULL attributes of this object with the attributes of
 * another.
 *
 * @param {TopologyLocation}
 *          gl
 */
jsts.geomgraph.TopologyLocation.prototype.merge = function(gl) {
  // if the src is an Area label & and the dest is not, increase the dest to be
  // an Area
  if (gl.location.length > this.location.length) {
    var newLoc = [];
    newLoc[jsts.geomgraph.Position.ON] = this.location[jsts.geomgraph.Position.ON];
    newLoc[jsts.geomgraph.Position.LEFT] = jsts.geom.Location.NONE;
    newLoc[jsts.geomgraph.Position.RIGHT] = jsts.geom.Location.NONE;
    this.location = newLoc;
  }
  for (var i = 0; i < this.location.length; i++) {
    if (this.location[i] === jsts.geom.Location.NONE && i < gl.location.length)
      this.location[i] = gl.location[i];
  }
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


/**
 * @namespace
 */
jsts.geomgraph.index = {};


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * @constructor
 */
jsts.geomgraph.index.EdgeSetIntersector = function() {

};


/**
 * Computes all self-intersections between edges in a set of edges, allowing
 * client to choose whether self-intersections are computed.
 *
 * @param {[]}
 *          edges a list of edges to test for intersections.
 * @param {SegmentIntersector}
 *          si the SegmentIntersector to use.
 * @param {boolean}
 *          testAllSegments true if self-intersections are to be tested as well.
 */
jsts.geomgraph.index.EdgeSetIntersector.prototype.computeIntersections = function(
    edges, si, testAllSegments) {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * Computes all mutual intersections between two sets of edges.
 *
 * @param {[]}
 *          edges0 a list of edges to test for intersections.
 * @param {[]}
 *          edges1 a list of edges to test for intersections.
 * @param {SegmentIntersector}
 *          si the SegmentIntersector to use.
 */
jsts.geomgraph.index.EdgeSetIntersector.prototype.computeIntersections = function(
    edges0, edges1, si) {
  throw new jsts.error.AbstractMethodInvocationError();
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Computes the intersection of line segments, and adds the intersection to the
 * edges containing the segments.
 *
 * @param {LineIntersector}
 *          li
 * @param {boolean}
 *          includeProper
 * @param {boolean}
 *          recordIsolated
 * @constructor
 */
jsts.geomgraph.index.SegmentIntersector = function(li, includeProper,
    recordIsolated) {
  this.li = li;
  this.includeProper = includeProper;
  this.recordIsolated = recordIsolated;
};


/**
 * @param {int}
 *          i1
 * @param {int}
 *          i2
 * @return {boolean}
 */
jsts.geomgraph.index.SegmentIntersector.isAdjacentSegments = function(i1, i2) {
  return Math.abs(i1 - i2) === 1;
};


/**
 * @type {boolean}
 * @private
 */
jsts.geomgraph.index.SegmentIntersector.prototype._hasIntersection = false;


/**
 * @type {boolean}
 * @private
 */
jsts.geomgraph.index.SegmentIntersector.prototype.hasProper = false;


/**
 * @type {boolean}
 * @private
 */
jsts.geomgraph.index.SegmentIntersector.prototype.hasProperInterior = false;


/**
 * the proper intersection point found
 *
 * @type {Coordinate}
 * @private
 */
jsts.geomgraph.index.SegmentIntersector.prototype.properIntersectionPoint = null;


/**
 * @type {LineIntersector}
 * @private
 */
jsts.geomgraph.index.SegmentIntersector.prototype.li = null;


/**
 * @type {boolean}
 * @private
 */
jsts.geomgraph.index.SegmentIntersector.prototype.includeProper = null;


/**
 * @type {boolean}
 * @private
 */
jsts.geomgraph.index.SegmentIntersector.prototype.recordIsolated = null;


/**
 * @type {boolean}
 * @private
 */
jsts.geomgraph.index.SegmentIntersector.prototype.isSelfIntersection = null;


/**
 * @type {int}
 * @private
 */
jsts.geomgraph.index.SegmentIntersector.prototype.numIntersections = 0;


/**
 * testing only
 *
 * @type {int}
 */
jsts.geomgraph.index.SegmentIntersector.prototype.numTests = 0;


/**
 * @type {[]}
 * @private
 */
jsts.geomgraph.index.SegmentIntersector.prototype.bdyNodes = null;


/**
 * @param {[]}
 *          bdyNodes0
 * @param {[]}
 *          bdyNodes1
 */
jsts.geomgraph.index.SegmentIntersector.prototype.setBoundaryNodes = function(
    bdyNodes0, bdyNodes1) {
  this.bdyNodes = [];
  this.bdyNodes[0] = bdyNodes0;
  this.bdyNodes[1] = bdyNodes1;
};


/**
 * @return {Coordinate} the proper intersection point, or <code>null</code> if
 *         none was found.
 */
jsts.geomgraph.index.SegmentIntersector.prototype.getProperIntersectionPoint = function() {
  return this.properIntersectionPoint;
};


/**
 * @return {boolean}
 */
jsts.geomgraph.index.SegmentIntersector.prototype.hasIntersection = function() {
  return this._hasIntersection;
};


/**
 * A proper intersection is an intersection which is interior to at least two
 * line segments. Note that a proper intersection is not necessarily in the
 * interior of the entire Geometry, since another edge may have an endpoint
 * equal to the intersection, which according to SFS semantics can result in the
 * point being on the Boundary of the Geometry.
 *
 * @return {boolean}
 */
jsts.geomgraph.index.SegmentIntersector.prototype.hasProperIntersection = function() {
  return this.hasProper;
};


/**
 * A proper interior intersection is a proper intersection which is <b>not</b>
 * contained in the set of boundary nodes set for this SegmentIntersector.
 *
 * @return {boolean}
 */
jsts.geomgraph.index.SegmentIntersector.prototype.hasProperInteriorIntersection = function() {
  return this.hasProperInterior;
};


/**
 * A trivial intersection is an apparent self-intersection which in fact is
 * simply the point shared by adjacent line segments. Note that closed edges
 * require a special check for the point shared by the beginning and end
 * segments.
 *
 * @param {Edge}
 *          e0
 * @param {int}
 *          segIndex0
 * @param {Edge}
 *          e1
 * @param {int}
 *          segIndex1
 * @return {boolean}
 */
jsts.geomgraph.index.SegmentIntersector.prototype.isTrivialIntersection = function(
    e0, segIndex0, e1, segIndex1) {
  if (e0 == e1) {
    if (this.li.getIntersectionNum() == 1) {
      if (jsts.geomgraph.index.SegmentIntersector.isAdjacentSegments(segIndex0,
          segIndex1))
        return true;
      if (e0.isClosed()) {
        var maxSegIndex = e0.getNumPoints() - 1;
        if ((segIndex0 == 0 && segIndex1 == maxSegIndex) ||
            (segIndex1 == 0 && segIndex0 == maxSegIndex)) {
          return true;
        }
      }
    }
  }
  return false;
};


/**
 * This method is called by clients of the EdgeIntersector class to test for and
 * add intersections for two segments of the edges being intersected. Note that
 * clients (such as MonotoneChainEdges) may choose not to intersect certain
 * pairs of segments for efficiency reasons.
 *
 * @param {Edge}
 *          e0
 * @param {int}
 *          segIndex0
 * @param {Edge}
 *          e1
 * @param {int}
 *          segIndex1
 */
jsts.geomgraph.index.SegmentIntersector.prototype.addIntersections = function(
    e0, segIndex0, e1, segIndex1) {
  if (e0 === e1 && segIndex0 === segIndex1)
    return;
  this.numTests++;
  var p00 = e0.getCoordinates()[segIndex0];
  var p01 = e0.getCoordinates()[segIndex0 + 1];
  var p10 = e1.getCoordinates()[segIndex1];
  var p11 = e1.getCoordinates()[segIndex1 + 1];

  this.li.computeIntersection(p00, p01, p10, p11);
  /**
   * Always record any non-proper intersections. If includeProper is true,
   * record any proper intersections as well.
   */
  if (this.li.hasIntersection()) {
    if (this.recordIsolated) {
      e0.setIsolated(false);
      e1.setIsolated(false);
    }
    this.numIntersections++;
    // if the segments are adjacent they have at least one trivial intersection,
    // the shared endpoint. Don't bother adding it if it is the
    // only intersection.
    if (!this.isTrivialIntersection(e0, segIndex0, e1, segIndex1)) {
      this._hasIntersection = true;
      if (this.includeProper || !this.li.isProper()) {
        e0.addIntersections(this.li, segIndex0, 0);
        e1.addIntersections(this.li, segIndex1, 1);
      }
      if (this.li.isProper()) {
        this.properIntersectionPoint = this.li.getIntersection(0).clone();
        this.hasProper = true;
        if (!this.isBoundaryPoint(this.li, this.bdyNodes))
          this.hasProperInterior = true;
      }
    }
  }
};


/**
 * @param {LineIntersector}
 *          li
 * @param {[][]}
 *          bdyNodes
 * @return {boolean}
 * @private
 */
jsts.geomgraph.index.SegmentIntersector.prototype.isBoundaryPoint = function(
    li, bdyNodes) {
  if (bdyNodes === null)
    return false;

  if (bdyNodes[0] instanceof Array) {
    if (this.isBoundaryPoint(li, bdyNodes[0]))
      return true;
    if (this.isBoundaryPoint(li, bdyNodes[1]))
      return true;
    return false;
  } else {
    for (var i = 0; i < bdyNodes.length; i++) {
      var node = bdyNodes[i];
      var pt = node.getCoordinate();
      if (li.isIntersection(pt))
        return true;
    }
    return false;
  }
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geomgraph/index/EdgeSetIntersector.js
 */



/**
 * Finds all intersections in one or two sets of edges, using the
 * straightforward method of comparing all segments. This algorithm is too slow
 * for production use, but is useful for testing purposes.
 *
 * @constructor
 */
jsts.geomgraph.index.SimpleEdgeSetIntersector = function() {

};

jsts.geomgraph.index.SimpleEdgeSetIntersector.prototype = new jsts.geomgraph.index.EdgeSetIntersector();


/**
 * statistics information
 *
 * @type {int}
 */
jsts.geomgraph.index.SimpleEdgeSetIntersector.prototype.nOverlaps = 0;


/**
 * @param {[]}
 *          edges
 * @param {SegmentIntersector}
 *          si
 * @param {boolean}
 *          testAllSegments
 */
jsts.geomgraph.index.SimpleEdgeSetIntersector.prototype.computeIntersections = function(
    edges, si, testAllSegments) {

  if (si instanceof Array) {
    this.computeIntersections2.apply(this, arguments);
    return;
  }

  var i0, i1, edge0, edge1;

  this.nOverlaps = 0;

  for (i0 = 0; i0 < edges.length; i0++) {
    edge0 = edges[i0];
    for (i1 = 0; i1 < edges.length; i1++) {
      edge1 = edges[i1];
      if (testAllSegments || edge0 !== edge1) {
        this.computeIntersects(edge0, edge1, si);
      }
    }
  }
};


/**
 * @param {[]}
 *          edges0
 * @param {[]}
 *          edges1
 * @param {SegmentIntersector}
 *          si
 */
jsts.geomgraph.index.SimpleEdgeSetIntersector.prototype.computeIntersections2 = function(
    edges0, edges1, si) {
  this.nOverlaps = 0;

  for (var i0 = 0; i0 < edges0.length; i0++) {
    var edge0 = edges0[i0];
    for (var i1 = 0; i1 < edges1.length; i1++) {
      var edge1 = edges1[i1];
      this.computeIntersects(edge0, edge1, si);
    }
  }
};


/**
 * Performs a brute-force comparison of every segment in each Edge. This has n^2
 * performance, and is about 100 times slower than using monotone chains.
 *
 * @param {Edge}
 *          e0
 * @param {Edge}
 *          e1
 * @param {SegmentIntersector}
 *          si
 */
jsts.geomgraph.index.SimpleEdgeSetIntersector.prototype.computeIntersects = function(
    e0, e1, si) {
  var pts0 = e0.getCoordinates();
  var pts1 = e1.getCoordinates();
  var i0, i1;
  for (i0 = 0; i0 < pts0.length - 1; i0++) {
    for (i1 = 0; i1 < pts1.length - 1; i1++) {
      si.addIntersections(e0, i0, e1, i1);
    }
  }
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geomgraph/index/EdgeSetIntersector.js
 */



/**
 * Finds all intersections in one or two sets of edges,
 * using an x-axis sweepline algorithm in conjunction with Monotone Chains.
 * While still O(n^2) in the worst case, this algorithm
 * drastically improves the average-case time.
 * The use of MonotoneChains as the items in the index
 * seems to offer an improvement in performance over a sweep-line alone.
 * @constructor
 */
jsts.geomgraph.index.SimpleMCSweepLineIntersector = function() {
  throw new jsts.error.NotImplementedError();
};


jsts.geomgraph.index.SimpleMCSweepLineIntersector.prototype = new jsts.geomgraph.index.EdgeSetIntersector();

// TODO: port

/* Copyright (c) 2011 by The Authors.
* Published under the LGPL 2.1 license.
* See /license-notice.txt for the full text of the license notice.
* See /license.txt for the full text of the license.
*/


/**
 * @namespace
 */
jsts.index = {};

/* Copyright (c) 2011 by The Authors.
* Published under the LGPL 2.1 license.
* See /license-notice.txt for the full text of the license notice.
* See /license.txt for the full text of the license.
*/



/**
 * An array-visitor
 *
 * Initializes this class with the openlayers inheritance mechanism
 *
 * @constructor
 */
jsts.index.ArrayListVisitor = function() {
  this.items = [];
};


/**
 * Visits an item
 *
 * @param {Object}
 *          item the item to visit.
 */
jsts.index.ArrayListVisitor.prototype.visitItem = function(item) {
  this.items.push(item);
};


/**
 * Returns all visited items
 *
 * @return {Array} An array with all visited items.
 */
jsts.index.ArrayListVisitor.prototype.getItems = function() {
  return this.items;
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * DoubleBits manipulates Double numbers by using bit manipulation and bit-field
 * extraction. For some operations (such as determining the exponent) this is
 * more accurate than using mathematical operations (which suffer from round-off
 * error).
 * <p>
 * The algorithms and constants in this class apply only to IEEE-754
 * double-precision floating point format.
 *
 * NOTE: Since the only numberformat in JavaScript is IEEE-754 the code in
 * DoubleBits could not be easily ported.
 *
 * Instead, using algorithms found here:
 * http://www.merlyn.demon.co.uk/js-exact.htm
 *
 * @constructor
 */
jsts.index.DoubleBits = function() {

};


/**
 * Calculates the power of two for a number
 *
 * @param {Number}
 *          exp value to pow.
 * @return {Number} the pow'ed value.
 */
jsts.index.DoubleBits.powerOf2 = function(exp) {
  // TODO: Make sure the accuracy of this is sufficient (why else would JTS have
  // this in DoubleBits?)
  return Math.pow(2, exp);
};


/**
 * Calculates the exponent-part of the bit-pattern for a number
 *
 * @param {Number}
 *          d the IEEE-754-value to calculate the exponent for.
 * @return {Number} the exponent part of the bit-mask.
 */
jsts.index.DoubleBits.exponent = function(d) {
  return jsts.index.DoubleBits.CVTFWD(64, d) - 1023;
};


/**
 * Calculates the exponent of the bit-pattern for a number. Uses code from:
 * http://www.merlyn.demon.co.uk/js-exact.htm
 *
 * @param {Number}
 *          NumW 32 or 64 to denote the number of bits.
 * @param {Number}
 *          Qty the number to calculate the bit pattern for.
 * @return {Number} The integer value of the exponent.
 */
jsts.index.DoubleBits.CVTFWD = function(NumW, Qty) {
  var Sign, Expo, Mant, Bin, nb01 = ''; // , OutW = NumW/4
  var Inf = {
    32: {
      d: 0x7F,
      c: 0x80,
      b: 0,
      a: 0
    },
    64: {
      d: 0x7FF0,
      c: 0,
      b: 0,
      a: 0
    }
  };
  var ExW = {
    32: 8,
    64: 11
  }[NumW], MtW = NumW - ExW - 1;

  if (!Bin) {
    Sign = Qty < 0 || 1 / Qty < 0; // OK for +-0
    if (!isFinite(Qty)) {
      Bin = Inf[NumW];
      if (Sign) {
        Bin.d += 1 << (NumW / 4 - 1);
      }
      Expo = Math.pow(2, ExW) - 1;
      Mant = 0;
    }
  }

  if (!Bin) {
    Expo = {
      32: 127,
      64: 1023
    }[NumW];
    Mant = Math.abs(Qty);
    while (Mant >= 2) {
      Expo++;
      Mant /= 2;
    }
    while (Mant < 1 && Expo > 0) {
      Expo--;
      Mant *= 2;
    }
    if (Expo <= 0) {
      Mant /= 2;
      nb01 = 'Zero or Denormal';
    }
    if (NumW === 32 && Expo > 254) {
      nb01 = 'Too big for Single';
      Bin = {
        d: Sign ? 0xFF : 0x7F,
        c: 0x80,
        b: 0,
        a: 0
      };
      Expo = Math.pow(2, ExW) - 1;
      Mant = 0;
    }
  }

  return Expo;
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
*/



/**
 * Provides a test for whether an interval is so small it should be considered
 * as zero for the purposes of inserting it into a binary tree. The reason this
 * check is necessary is that round-off error can cause the algorithm used to
 * subdivide an interval to fail, by computing a midpoint value which does not
 * lie strictly between the endpoints.
 *
 * @constructor
 */
jsts.index.IntervalSize = function() {

};


/**
 * This value is chosen to be a few powers of 2 less than the number of bits
 * available in the double representation (i.e. 53). This should allow enough
 * extra precision for simple computations to be correct, at least for
 * comparison purposes.
 */
jsts.index.IntervalSize.MIN_BINARY_EXPONENT = -50;


/**
 * Computes whether the interval [min, max] is effectively zero width. I.e. the
 * width of the interval is so much less than the location of the interval that
 * the midpoint of the interval cannot be represented precisely.
 *
 * @param {Number}
 *          min the min-value in the interval.
 * @param {Number}
 *          max the max-value in the interval.
 * @return {Boolean} true if the interval should be considered zero.
 */
jsts.index.IntervalSize.isZeroWidth = function(min, max) {
  var width = max - min;
  if (width === 0.0) {
    return true;
  }

  var maxAbs, scaledInterval, level;
  maxAbs = Math.max(Math.abs(min), Math.abs(max));
  scaledInterval = width / maxAbs;

  level = jsts.index.DoubleBits.exponent(scaledInterval);
  return level <= jsts.index.IntervalSize.MIN_BINARY_EXPONENT;
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


/**
 * @namespace
 */
jsts.index.quadtree = {

};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * A Key is a unique identifier for a node in a quadtree. It contains a
 * lower-left point and a level number. The level number is the power of two for
 * the size of the node envelope.
 *
 * @param {jsts.geom.Envelope}
 *          itemEnv the envelope of the key.
 *
 * @constructor
 */
jsts.index.quadtree.Key = function(itemEnv) {
  // the fields which make up the key
  this.pt = new jsts.geom.Coordinate();
  this.level = 0;
  // auxiliary data which is derived from the key for use in computation
  this.env = null;

  this.computeKey(itemEnv);
};


/**
 * Computes the quad-level for specified envelope
 *
 * @param {jsts.geom.Envelope}
 *          env the envelope to calculate level for.
 * @return {Number} The calculated level.
 */
jsts.index.quadtree.Key.computeQuadLevel = function(env) {
  var dx, dy, dMax, level;

  dx = env.getWidth();
  dy = env.getHeight();
  dMax = dx > dy ? dx : dy;
  level = jsts.index.DoubleBits.exponent(dMax) + 1;
  return level;
};


/**
 * Gets the point of this key.
 *
 * @return {jsts.geom.Coordinate} The point.
 */
jsts.index.quadtree.Key.prototype.getPoint = function() {
  return this.pt;
};


/**
 * Gets the level of this key
 *
 * @return {Number} The level.
 */
jsts.index.quadtree.Key.prototype.getLevel = function() {
  return this.level;
};


/**
 * Gets the envelope of this key
 *
 * @return {jsts.geom.Envelope} The envelope.
 */
jsts.index.quadtree.Key.prototype.getEnvelope = function() {
  return this.env;
};


/**
 * Gets the centre of this key
 *
 * @return {jsts.geom.Coordinate} the center-point.
 */
jsts.index.quadtree.Key.prototype.getCentre = function() {
  var x, y;
  x = (this.env.getMinX() + this.env.getMaxX()) / 2;
  y = (this.env.getMinY() + this.env.getMaxY()) / 2;
  return new jsts.geom.Coordinate(x, y);
};


/**
 * Will call appropriate computeKey* method depending on arguments.
 */
jsts.index.quadtree.Key.prototype.computeKey = function() {
  if (arguments[0] instanceof jsts.geom.Envelope) {
    this.computeKeyFromEnvelope(arguments[0]);
  } else {
    this.computeKeyFromLevel(arguments[0], arguments[1]);
  }
};


/**
 * Computes the key from specified envlope.
 *
 * @param {jsts.geom.Envelope}
 *          env the envelope.
 */
jsts.index.quadtree.Key.prototype.computeKeyFromEnvelope = function(env) {
  this.level = jsts.index.quadtree.Key.computeQuadLevel(env);
  this.env = new jsts.geom.Envelope();
  this.computeKey(this.level, env);
  while (!this.env.contains(env)) {
    this.level += 1;
    this.computeKey(this.level, env);
  }
};


/**
 * Computes a key from a level and an envelope
 *
 * @param {Number}
 *          level the level.
 * @param {jsts.geom.Envelope}
 *          env the envelope.
 */
jsts.index.quadtree.Key.prototype.computeKeyFromLevel = function(level, env) {
  var quadSize = jsts.index.DoubleBits.powerOf2(level);
  this.pt.x = Math.floor(env.getMinX() / quadSize) * quadSize;
  this.pt.y = Math.floor(env.getMinY() / quadSize) * quadSize;
  this.env.init(this.pt.x, this.pt.x + quadSize, this.pt.y, this.pt.y +
      quadSize);
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * The base class for nodes in a {@link Quadtree}.
 * @constructor
 */
jsts.index.quadtree.NodeBase = function() {
  /**
   * subquads are numbered as follows:
   *
   * <pre>
   *  2 | 3
   *  --+--
   *  0 | 1
   * </pre>
   */
  this.subnode = new Array(4);
  this.subnode[0] = null;
  this.subnode[1] = null;
  this.subnode[2] = null;
  this.subnode[3] = null;

  this.items = [];
};


/**
 * Returns the index of the subquad that wholly contains the given envelope. If
 * none does, returns -1.
 *
 * @param {jsts.geom.Envelope}
 *          env The envelope to check.
 * @param {jsts.geom.Coordinate}
 *          centre The coordinate.
 * @return {Number} The sub-index or -1.
 */
jsts.index.quadtree.NodeBase.prototype.getSubnodeIndex = function(env, centre) {
  var subnodeIndex = -1;
  if (env.getMinX() >= centre.x) {
    if (env.getMinY() >= centre.y) {
      subnodeIndex = 3;
    }
    if (env.getMaxY() <= centre.y) {
      subnodeIndex = 1;
    }
  }
  if (env.getMaxX() <= centre.x) {
    if (env.getMinY() >= centre.y) {
      subnodeIndex = 2;
    }
    if (env.getMaxY() <= centre.y) {
      subnodeIndex = 0;
    }
  }
  return subnodeIndex;
};


/**
 * Returns the nodes items
 *
 * @return {Array} the items-array.
 */
jsts.index.quadtree.NodeBase.prototype.getItems = function() {
  return this.items;
};


/**
 * Checks if the node has any items
 *
 * @return {Boolean} true if the node has any items.
 */
jsts.index.quadtree.NodeBase.prototype.hasItems = function() {
  return (this.items.length > 0);
};


/**
 * Adds an item to the node
 *
 * @param {Object}
 *          item the item to add.
 */
jsts.index.quadtree.NodeBase.prototype.add = function(item) {
  this.items.push(item);
};


/**
 * Removes a single item from this subtree.
 *
 * @param {jsts.geom.Envelope}
 *          itemEnv the envelope containing the item.
 * @param {Object}
 *          item the item to remove.
 * @return {Boolean} <code>true</code> if the item was found and removed.
 */
jsts.index.quadtree.NodeBase.prototype.remove = function(itemEnv, item) {
  // use envelope to restrict nodes scanned
  if (!this.isSearchMatch(itemEnv)) {
    return false;
  }

  var found = false, i = 0;
  for (i; i < 4; i++) {
    if (this.subnode[i] !== null) {
      found = this.subnode[i].remove(itemEnv, item);
      if (found) {
        // trim subtree if empty
        if (this.subnode[i].isPrunable()) {
          this.subnode[i] = null;
        }
        break;
      }
    }
  }
  // if item was found lower down, don't need to search for it here
  if (found) {
    return found;
  }
  // otherwise, try and remove the item from the list of items in this node

  if (OpenLayers.Util.indexOf(this.items, item) !== -1) {
    OpenLayers.Util.removeItem(this.items, item);
    found = true;
  }
  return found;
};


/**
 * @return {Boolean} <code>true</code> if the node is prunable.
 */
jsts.index.quadtree.NodeBase.prototype.isPrunable = function() {
  return !(this.hasChildren() || this.hasItems());
};


/**
 * @return {Boolean} <code>true</code> if the node has any children.
 */
jsts.index.quadtree.NodeBase.prototype.hasChildren = function() {
  var i = 0;
  for (i; i < 4; i++) {
    if (this.subnode[i] !== null) {
      return true;
    }
  }
  return false;
};


/**
 * @return {Boolean} <code>true</code> if the node or any subnode does not
 *         have any items.
 */
jsts.index.quadtree.NodeBase.prototype.isEmpty = function() {
  var isEmpty = true;
  if (this.items.length > 0) {
    isEmpty = false;
  }
  var i = 0;
  for (i; i < 4; i++) {
    if (this.subnode[i] !== null) {
      if (!this.subnode[i].isEmpty()) {
        isEmpty = false;
      }
    }
  }
  return isEmpty;
};


/**
 * Adds all the items of the node and any subnodes
 *
 * @param {Array}
 *          resultItems the array to add items to.
 * @return {Array} a new array with original and added items.
 */
jsts.index.quadtree.NodeBase.prototype.addAllItems = function(resultItems) {
  // this node may have items as well as subnodes (since items may not
  // be wholely contained in any single subnode
  resultItems = resultItems.concat(this.items);
  var i = 0;
  for (i; i < 4; i++) {
    if (this.subnode[i] !== null) {
      resultItems = this.subnode[i].addAllItems(resultItems);
      //resultItems = resultItems.concat(this.subnode[i]);
    }
  }

  return resultItems;
};


/**
 *
 * @param {jsts.geom.Envelope}
 *          searchEnv the search-envelope.
 * @param {Array}
 *          resultItems the array containing original and added items.
 */
jsts.index.quadtree.NodeBase.prototype.addAllItemsFromOverlapping = function(
    searchEnv, resultItems) {
  if (!this.isSearchMatch(searchEnv)) {
    return;
  }

  // this node may have items as well as subnodes (since items may not
  // be wholely contained in any single subnode

  resultItems = resultItems.concat(this.items);

  var i = 0;
  for (i; i < 4; i++) {
    if (this.subnode[i] !== null) {
      resultItems = this.subnode[i].addAllItemsFromOverlapping(searchEnv,
          resultItems);
    }
  }
};


/**
 * Visits the node
 *
 * @param {jsts.geom.Envelope}
 *          searchEnv the search-envelope.
 * @param {Object}
 *          visitor the visitor.
 */
jsts.index.quadtree.NodeBase.prototype.visit = function(searchEnv, visitor) {
  if (!this.isSearchMatch(searchEnv)) {
    return;
  }

  // this node may have items as well as subnodes (since items may not
  // be wholely contained in any single subnode
  this.visitItems(searchEnv, visitor);

  var i = 0;
  for (i; i < 4; i++) {
    if (this.subnode[i] !== null) {
      this.subnode[i].visit(searchEnv, visitor);
    }
  }
};


/**
 * Visits the items
 *
 * @param {jsts.geom.Envelope}
 *          env the search envelope.
 * @param {Object}
 *          visitor the visitor.
 */
jsts.index.quadtree.NodeBase.prototype.visitItems = function(env, visitor) {
  var i = 0, il = this.items.length;

  for (i; i < il; i++) {
    visitor.visitItem(this.items[i]);
  }
};


/**
 * Calculates the depth
 *
 * @return {Number} the calculated depth.
 */
jsts.index.quadtree.NodeBase.prototype.depth = function() {
  var maxSubDepth = 0, i = 0, sqd;
  for (i; i < 4; i++) {
    if (this.subnode[i] !== null) {
      sqd = this.subnode[i].depth();
      if (sqd > maxSubDepth) {
        maxSubDepth = sqd;
      }
    }
  }
  return maxSubDepth + 1;
};


/**
 * Calculates the size
 *
 * @return {Number} the calculated size.
 */
jsts.index.quadtree.NodeBase.prototype.size = function() {
  var subSize = 0, i = 0;
  for (i; i < 4; i++) {
    if (this.subnode[i] !== null) {
      subSize += this.subnode[i].size();
    }
  }
  return subSize + this.items.length;
};


/**
 * Counts the nodes
 *
 * @return {Number} the size of this node.
 */
jsts.index.quadtree.NodeBase.prototype.getNodeCount = function() {
  var subSize = 0, i = 0;
  for (i; i < 4; i++) {
    if (this.subnode[i] !== null) {
      subSize += this.subnode[i].size();
    }
  }
  return subSize + 1;
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Represents a node of a {@link Quadtree}. Nodes contain items which have a
 * spatial extent corresponding to the node's position in the quadtree.
 *
 * @param {jsts.geom.Envelope}
 *          env Envelope to initialize from.
 * @param {Number}
 *          level The level.
 *
 * @constructor
 * @requires jsts/index/quadtree/NodeBase.js
 */
jsts.index.quadtree.Node = function(env, level) {
  jsts.index.quadtree.NodeBase.prototype.constructor.apply(this, arguments);

  this.env = env;
  this.level = level;
  this.centre = new jsts.geom.Coordinate();
  this.centre.x = (env.getMinX() + env.getMaxX()) / 2;
  this.centre.y = (env.getMinY() + env.getMaxY()) / 2;
};

jsts.index.quadtree.Node.prototype = new jsts.index.quadtree.NodeBase();


/**
 * Creates a node from specified envelope
 *
 * @param {jsts.geom.Envelope}
 *          env the envelope.
 * @return {jsts.index.quadtree.Node} the created node.
 */
jsts.index.quadtree.Node.createNode = function(env) {
  var key, node;
  key = new jsts.index.quadtree.Key(env);
  node = new jsts.index.quadtree.Node(key.getEnvelope(), key.getLevel());

  return node;
};


/**
 * Creates an expanded node.
 *
 * @param {jsts.index.quadtree.Node}
 *          node the node to create a new node from.
 * @param {jsts.geom.Envelope}
 *          addEnv the envelope.
 * @return {jsts.index.quadtree.Node} the created node.
 */
jsts.index.quadtree.Node.createExpanded = function(node, addEnv) {
  var expandEnv = new jsts.geom.Envelope(addEnv), largerNode;

  if (node !== null) {
    expandEnv.expandToInclude(node.env);
  }

  largerNode = jsts.index.quadtree.Node.createNode(expandEnv);
  if (node !== null) {
    largerNode.insertNode(node);
  }

  return largerNode;
};


/**
 * Gets the envelope for this node
 *
 * @return {jsts.geom.Envelope} the envelope.
 */
jsts.index.quadtree.Node.prototype.getEnvelope = function() {
  return this.env;
};


/**
 * Checks wheter the provided envelope intersects this nodes envelope.
 *
 * @param {jsts.geom.Envelope}
 *          searchEnv the envelope to search.
 * @return {Boolean} True if searchEnv intersects this nodes envelope.
 */
jsts.index.quadtree.Node.prototype.isSearchMatch = function(searchEnv) {
  return this.env.intersects(searchEnv);
};


/**
 * Returns the subquad containing the envelope. Creates the subquad if it does
 * not already exist.
 *
 * @param {jsts.geom.Envelope}
 *          searchEnv the input envelope.
 * @return {jsts.index.quadtree.Node} the node containing the searchEnv.
 */
jsts.index.quadtree.Node.prototype.getNode = function(searchEnv) {
  var subnodeIndex = this.getSubnodeIndex(searchEnv, this.centre), node;

  // if subquadIndex is -1 searchEnv is not contained in a subquad
  if (subnodeIndex !== -1) {
    // create the quad if it does not exist
    node = this.getSubnode(subnodeIndex);
    // recursively search the found/created quad
    return node.getNode(searchEnv);
  } else {
    return this;
  }
};


/**
 * Returns the smallest <i>existing</i> node containing the envelope.
 *
 * @param {jsts.geom.Envelope}
 *          searchEnv input Envelope.
 * @return {jsts.index.quadtree.Node} the smallest node containing searchEnv.
 */
jsts.index.quadtree.Node.prototype.find = function(searchEnv) {
  var subnodeIndex = this.getSubnodeIndex(searchEnv, this.centre), node;
  if (subnodeIndex === -1) {
    return this;
  }

  if (this.subnode[subnodeIndex] !== null) {
    // query lies in subquad, so search it
    node = this.subnode[subnodeIndex];
    return node.find(searchEnv);
  }

  // no existing subquad, so return this one anyway
  return this;
};


/**
 * Inserts a child-node
 *
 * @param {jsts.index.quadtree.Node}
 *          node to insert.
 */
jsts.index.quadtree.Node.prototype.insertNode = function(node) {
  var index = this.getSubnodeIndex(node.env, this.centre), childNode;
  if (node.level === this.level - 1) {
    this.subnode[index] = node;
  } else {
    // the quad is not a direct child, so make a new child quad to contain it
    // and recursively insert the quad
    childNode = this.createSubnode(index);
    childNode.insertNode(node);
    this.subnode[index] = childNode;
  }
};


/**
 * get the subquad for the index. If it doesn't exist, create it
 *
 * @param {Number}
 *          index the index of the subnode to get.
 * @return {jsts.index.quadtree.Node} the specified subnode.
 */
jsts.index.quadtree.Node.prototype.getSubnode = function(index) {
  if (this.subnode[index] === null) {
    this.subnode[index] = this.createSubnode(index);
  }
  return this.subnode[index];
};


/**
 * Creates a subnode
 *
 * @param {Number}
 *          index The index (0-4) on where to create a subnode.
 * @return {jsts.index.quadtree.Node} the created node.
 */
jsts.index.quadtree.Node.prototype.createSubnode = function(index) {
  var minx = 0.0, maxx = 0.0, miny = 0.0, maxy = 0.0, sqEnv, node;
  // create a new subquad in the appropriate quadrant
  switch (index) {
    case 0:
      minx = this.env.getMinX();
      maxx = this.centre.x;
      miny = this.env.getMinY();
      maxy = this.centre.y;
      break;
    case 1:
      minx = this.centre.x;
      maxx = this.env.getMaxX();
      miny = this.env.getMinY();
      maxy = this.centre.y;
      break;
    case 2:
      minx = this.env.getMinX();
      maxx = this.centre.x;
      miny = this.centre.y;
      maxy = this.env.getMaxY();
      break;
    case 3:
      minx = this.centre.x;
      maxx = this.env.getMaxX();
      miny = this.centre.y;
      maxy = this.env.getMaxY();
      break;
  }

  sqEnv = new jsts.geom.Envelope(minx, maxx, miny, maxy);
  node = new jsts.index.quadtree.Node(sqEnv, this.level - 1);

  return node;
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
*/



/**
 * A Quadtree is a spatial index structure for efficient querying of 2D
 * rectangles. If other kinds of spatial objects need to be indexed they can be
 * represented by their envelopes
 * <p>
 * The quadtree structure is used to provide a primary filter for range
 * rectangle queries. The query() method returns a list of all objects which
 * <i>may</i> intersect the query rectangle. Note that it may return objects
 * which do not in fact intersect. A secondary filter is required to test for
 * exact intersection. Of course, this secondary filter may consist of other
 * tests besides intersection, such as testing other kinds of spatial
 * relationships.
 *
 * <p>
 * This implementation does not require specifying the extent of the inserted
 * items beforehand. It will automatically expand to accomodate any extent of
 * dataset.
 * <p>
 * This data structure is also known as an <i>MX-CIF quadtree</i> following the
 * usage of Samet and others.
 *
 * @constructor
 */
jsts.index.quadtree.Quadtree = function() {
  this.root = new jsts.index.quadtree.Root();

  /**
   * minExtent is the minimum envelope extent of all items inserted into the
   * tree so far. It is used as a heuristic value to construct non-zero
   * envelopes for features with zero X and/or Y extent. Start with a non-zero
   * extent, in case the first feature inserted has a zero extent in both
   * directions. This value may be non-optimal, but only one feature will be
   * inserted with this value.
   */
  this.minExtent = 1.0;
};

/**
 * Ensure that the envelope for the inserted item has non-zero extents. Use the
 * current minExtent to pad the envelope, if necessary
 */


/**
 * Ensures an extent is not zero.
 *
 * @param {jsts.geom.Envelope}
 *          itemEnv The envelope to check.
 * @param {Number}
 *          minExtent the minimum width/height to expand the extent with if it
 *          is zero.
 * @return {jsts.geom.Envelope} A valid extent.
 */
jsts.index.quadtree.Quadtree.ensureExtent = function(itemEnv, minExtent) {
  var minx, maxx, miny, maxy;

  minx = itemEnv.getMinX();
  maxx = itemEnv.getMaxX();
  miny = itemEnv.getMinY();
  maxy = itemEnv.getMaxY();

  // has a non-zero extent
  if (minx !== maxx && miny !== maxy) {
    return itemEnv;
  }

  // pad one or both extents
  if (minx === maxx) {
    minx = minx - (minExtent / 2.0);
    maxx = minx + (minExtent / 2.0);
  }

  if (miny === maxy) {
    miny = miny - (minExtent / 2.0);
    maxy = miny + (minExtent / 2.0);
  }

  return new jsts.geom.Envelope(minx, maxx, miny, maxy);
};


/**
 * Returns the depth of the tree.
 *
 * @return {Number} the depth.
 */
jsts.index.quadtree.Quadtree.prototype.depth = function() {
  return this.root.depth();
};


/**
 * Returns the number of items in the tree.
 *
 * @return {Number} the number of items in the tree.
 */
jsts.index.quadtree.Quadtree.prototype.size = function() {
  return this.root.size();
};


/**
 * Inserts an item to the tree
 *
 * @param {jsts.geom.Envelope}
 *          itemEnv The envelope.
 * @param {Object}
 *          item The item.
 */
jsts.index.quadtree.Quadtree.prototype.insert = function(itemEnv, item) {
  this.collectStats(itemEnv);
  var insertEnv = jsts.index.quadtree.Quadtree.ensureExtent(itemEnv,
      this.minExtent);
  this.root.insert(insertEnv, item);
};


/**
 * Removes a single item from the tree
 *
 * @param {jsts.geom.Envelope}
 *          itemEnv the envelope of the item to be removed.
 * @param {Object}
 *          item the item to remove.
 * @return {Boolean} <code>true</true> if the item was found (and removed).
 */
jsts.index.quadtree.Quadtree.prototype.remove = function(itemEnv, item) {
  var posEnv = jsts.index.quadtree.Quadtree.ensureExtent(itemEnv,
      this.minExtent);
  return this.root.remove(posEnv, item);
};


/**
 * Querys the quadtree.
 *
 * Calls appropriate function depending on arguments
 */
jsts.index.quadtree.Quadtree.prototype.query = function() {
  if (arguments.length === 1) {
    return jsts.index.quadtree.Quadtree.prototype.queryByEnvelope.apply(this,
        arguments);
  } else {
    jsts.index.quadtree.Quadtree.prototype.queryWithVisitor.apply(this,
        arguments);
  }
};


/**
 * Queries the tree and returns items which may lie in the given search
 * envelope. Precisely, the items that are returned are all items in the tree
 * whose envelope <b>may</b> intersect the search Envelope. Note that some
 * items with non-intersecting envelopes may be returned as well; the client is
 * responsible for filtering these out. In most situations there will be many
 * items in the tree which do not intersect the search envelope and which are
 * not returned - thus providing improved performance over a simple linear scan.
 *
 * @param {jsts.geom.Envelope}
 *          searchEnv the envelope of the desired query area.
 * @return {Array} an array of items which may intersect the search envelope.
 */
jsts.index.quadtree.Quadtree.prototype.queryByEnvelope = function(searchEnv) {
  var visitor = new jsts.index.ArrayListVisitor();
  this.query(searchEnv, visitor);

  return visitor.getItems();
};


/**
 * Queries the tree and visits items which may lie in the given search envelope.
 * Precisely, the items that are visited are all items in the tree whose
 * envelope <b>may</b> intersect the search Envelope. Note that some items with
 * non-intersecting envelopes may be visited as well; the client is responsible
 * for filtering these out. In most situations there will be many items in the
 * tree which do not intersect the search envelope and which are not visited -
 * thus providing improved performance over a simple linear scan.
 *
 * @param {jsts.geom.Envelope}
 *          searchEnv the envelope of the desired query area.
 * @param {jsts.index.Visitor}
 *          visitor a visitor object which is passed the visited items.
 */
jsts.index.quadtree.Quadtree.prototype.queryWithVisitor = function(searchEnv,
    visitor) {
  this.root.visit(searchEnv, visitor);
};


/**
 * Returns an array of all items in the quadtree.
 *
 * @return {Array} An array of all items in the quadtree.
 */
jsts.index.quadtree.Quadtree.prototype.queryAll = function() {
  var foundItems = [];
  foundItems = this.root.addAllItems(foundItems);
  return foundItems;
};


/**
 * Checks wheter a width and height of an envelope is above zero and sets
 * minExtent if the widht or height is less than the current min extent
 *
 * @param {jsts.geom.Envelope}
 *          itemEnv The envelope.
 */
jsts.index.quadtree.Quadtree.prototype.collectStats = function(itemEnv) {
  var delX = itemEnv.getWidth();
  if (delX < this.minExtent && delX > 0.0) {
    this.minExtent = delX;
  }

  var delY = itemEnv.getHeight();
  if (delY < this.minExtent && delY > 0.0) {
    this.minExtent = delY;
  }
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
*/



/**
 * QuadRoot is the root of a single Quadtree. It is centred at the origin, and
 * does not have a defined extent.
 *
 * @constructor
 */
jsts.index.quadtree.Root = function() {
  jsts.index.quadtree.NodeBase.prototype.constructor.apply(this, arguments);

  // the root quad is centred at the origin.
  this.origin = new jsts.geom.Coordinate(0.0, 0.0);
};

jsts.index.quadtree.Root.prototype = new jsts.index.quadtree.NodeBase();


/**
 * Insert an item into the quadtree this is the root of.
 *
 * @param {jsts.geom.Envelope}
 *          itemEnv the item envelope.
 * @param {Object}
 *          item the item to insert.
 */
jsts.index.quadtree.Root.prototype.insert = function(itemEnv, item) {
  var index = this.getSubnodeIndex(itemEnv, this.origin);

  // if index is -1, itemEnv must cross the X or Y axis.
  if (index === -1) {
    this.add(item);
    return;
  }
  /**
   * the item must be contained in one quadrant, so insert it into the tree for
   * that quadrant (which may not yet exist)
   */
  var node = this.subnode[index];
  /**
   * If the subquad doesn't exist or this item is not contained in it, have to
   * expand the tree upward to contain the item.
   */

  if (node === null || !node.getEnvelope().contains(itemEnv)) {
    var largerNode = jsts.index.quadtree.Node.createExpanded(node, itemEnv);
    this.subnode[index] = largerNode;
  }
  /**
   * At this point we have a subquad which exists and must contain contains the
   * env for the item. Insert the item into the tree.
   */
  this.insertContained(this.subnode[index], itemEnv, item);
};


/**
 * insert an item which is known to be contained in the tree rooted at the given
 * QuadNode root. Lower levels of the tree will be created if necessary to hold
 * the item.
 *
 * @param {jsts.index.quadtree.Node}
 *          tree the root-node of the tree.
 * @param {jsts.geom.Envelope}
 *          itemEnv the envelope.
 * @param {Object}
 *          item the item to insert.
 */
jsts.index.quadtree.Root.prototype.insertContained = function(tree, itemEnv,
    item) {
  /**
   * Do NOT create a new quad for zero-area envelopes - this would lead to
   * infinite recursion. Instead, use a heuristic of simply returning the
   * smallest existing quad containing the query
   */
  var isZeroX, isZeroY, node;
  isZeroX = jsts.index.IntervalSize.isZeroWidth(itemEnv.getMinX(),
      itemEnv.getMaxX());
  isZeroY = jsts.index.IntervalSize.isZeroWidth(itemEnv.getMinY(),
      itemEnv.getMaxY());

  if (isZeroX || isZeroY) {
    node = tree.find(itemEnv);
  } else {
    node = tree.getNode(itemEnv);
  }
  node.add(item);
};


/**
 * Checks if the root is a search match.
 *
 * @param {jsts.geom.Envelope} searchEnv the envelope.
 * @return {Boolean} Always returns true for a root node.
 */
jsts.index.quadtree.Root.prototype.isSearchMatch = function(searchEnv) {
  return true;
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


/**
 * @namespace
 */
jsts.io = {};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Converts a geometry in Well-Known Text format to a {@link Geometry}.
 * <p>
 * <code>WKTReader</code> supports extracting <code>Geometry</code> objects
 * from either {@link Reader}s or {@link String}s. This allows it to function
 * as a parser to read <code>Geometry</code> objects from text blocks embedded
 * in other data formats (e.g. XML).
 * <P>
 * <p>
 * A <code>WKTReader</code> is parameterized by a <code>GeometryFactory</code>,
 * to allow it to create <code>Geometry</code> objects of the appropriate
 * implementation. In particular, the <code>GeometryFactory</code> determines
 * the <code>PrecisionModel</code> and <code>SRID</code> that is used.
 * <P>
 *
 * @constructor
 */
jsts.io.WKTReader = function() {
};


/**
 * Reads a Well-Known Text representation of a {@link Geometry}
 *
 * @param {string}
 *          wkt a <Geometry Tagged Text> string (see the OpenGIS Simple Features
 *          Specification).
 * @return {jsts.geom.Geometry} a <code>Geometry</code> read from
 *         <code>string.</code>
 */
jsts.io.WKTReader.prototype.read = function(wkt) {
  var geometry = OpenLayers.Geometry.fromWKT(wkt);

  if (geometry instanceof jsts.geom.Coordinate) {
    geometry = new jsts.geom.Point(geometry);
  }

  if (geometry === undefined) {
    var type = wkt.split(' ')[0].toLowerCase();
    switch (type) {
      case 'point':
        geometry = new OpenLayers.Geometry.Point();
        break;
      case 'multipoint':
        geometry = new OpenLayers.Geometry.MultiPoint();
        break;
      case 'linestring':
        geometry = new OpenLayers.Geometry.LineString();
        break;
      case 'multilinestring':
        geometry = new OpenLayers.Geometry.MultiLineString();
        break;
      case 'polygon':
        geometry = new OpenLayers.Geometry.Polygon();
        break;
      case 'multipolygon':
        geometry = new OpenLayers.Geometry.MultiPolygon();
        break;
    }

  }

  return geometry;
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Writes the Well-Known Text representation of a {@link Geometry}. The
 * Well-Known Text format is defined in the <A
 * HREF="http://www.opengis.org/techno/specs.htm"> OGC Simple Features
 * Specification for SQL</A>.
 * <p>
 * The <code>WKTWriter</code> outputs coordinates rounded to the precision
 * model. Only the maximum number of decimal places necessary to represent the
 * ordinates to the required precision will be output.
 * <p>
 * The SFS WKT spec does not define a special tag for {@link LinearRing}s.
 * Under the spec, rings are output as <code>LINESTRING</code>s.
 *
 * @see WKTReader
 * @constructor
 */
jsts.io.WKTWriter = function() {
};


/**
 * Converts a <code>Geometry</code> to its Well-known Text representation.
 *
 * @param {jsts.geom.Geometry}
 *          geometry a <code>Geometry</code> to process.
 * @return {string} a <Geometry Tagged Text> string (see the OpenGIS Simple
 *         Features Specification).
 */
jsts.io.WKTWriter.prototype.write = function(geometry) {
  var format = new OpenLayers.Format.WKT();
  var feature = new OpenLayers.Feature.Vector(geometry);
  var wkt = format.write(feature);

  return wkt;
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


/**
 * @namespace
 */
jsts.operation = {};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * The base class for operations that require {@link GeometryGraph}s.
 *
 * @param {Geometry}
 *          g0
 * @param {Geometry}
 *          g1
 * @param {BoundaryNodeRule}
 *          boundaryNodeRule
 * @constructor
 */
jsts.operation.GeometryGraphOperation = function(g0, g1, boundaryNodeRule) {
  this.li = new jsts.algorithm.RobustLineIntersector();
  this.arg = [];

  if (g0 === undefined) {
    return;
  }

  if (g1 === undefined) {
    this.setComputationPrecision(g0.getPrecisionModel());

    this.arg[0] = new jsts.geomgraph.GeometryGraph(0, g0);
    return;
  }

  boundaryNodeRule = boundaryNodeRule ||
      jsts.algorithm.BoundaryNodeRule.OGC_SFS_BOUNDARY_RULE;

  // use the most precise model for the result
  if (g0.getPrecisionModel().compareTo(g1.getPrecisionModel()) >= 0)
    this.setComputationPrecision(g0.getPrecisionModel());
  else
    this.setComputationPrecision(g1.getPrecisionModel());

  this.arg[0] = new jsts.geomgraph.GeometryGraph(0, g0, boundaryNodeRule);
  this.arg[1] = new jsts.geomgraph.GeometryGraph(1, g1, boundaryNodeRule);
};


/**
 * @type {LineIntersector}
 * @protected
 */
jsts.operation.GeometryGraphOperation.prototype.li = null;


/**
 * @type {PrecisionModel}
 * @protected
 */
jsts.operation.GeometryGraphOperation.prototype.resultPrecisionModel = null;


/**
 * The operation args into an array so they can be accessed by index
 *
 * @type {GeometryGraph[]}
 * @protected
 */
jsts.operation.GeometryGraphOperation.prototype.arg = null;


/**
 * @param {int}
 *          i
 * @return {Geometry}
 */
jsts.operation.GeometryGraphOperation.prototype.getArgGeometry = function(i) {
  return arg[i].getGeometry();
};


/**
 * @param {PrecisionModel}
 *          pm
 * @protected
 */
jsts.operation.GeometryGraphOperation.prototype.setComputationPrecision = function(pm) {
  this.resultPrecisionModel = pm;
  this.li.setPrecisionModel(this.resultPrecisionModel);
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Tests whether a <code>Geometry</code> is simple.
 * In general, the SFS specification of simplicity
 * follows the rule:
 * <ul>
 *  <li>A Geometry is simple if and only if the only self-intersections are at
 *  boundary points.</li>
 * </ul>
 * This definition relies on the definition of boundary points.
 * The SFS uses the Mod-2 rule to determine which points are on the boundary of
 * lineal geometries, but this class supports
 * using other {@link BoundaryNodeRule}s as well.
 * <p>
 * Simplicity is defined for each {@link Geometry} subclass as follows:
 * <ul>
 * <li>Valid polygonal geometries are simple by definition, so
 * <code>isSimple</code> trivially returns true.
 * (Hint: in order to check if a polygonal geometry has self-intersections,
 * use {@link Geometry#isValid}).
 * <li>Linear geometries are simple iff they do not self-intersect at points
 * other than boundary points.
 * (Using the Mod-2 rule, this means that closed linestrings
 * cannot be touched at their endpoints, since these are
 * interior points, not boundary points).
 * <li>Zero-dimensional geometries (points) are simple iff they have no
 * repeated points.
 * <li>Empty <code>Geometry</code>s are always simple
 * </ul>
 *
 * @see BoundaryNodeRule
 */



/**
 * Creates a simplicity checker using the default SFS Mod-2 Boundary Node Rule
 *
 * @param {Geometry}
 *          geom the geometry to test.
 * @constructor
 */
jsts.operation.IsSimpleOp = function(geom) {
  this.geom = geom;
};


/**
 * @type {jsts.geom.Geometry}
 */
jsts.operation.IsSimpleOp.prototype.geom = null;


/**
 * @type {boolean}
 */
jsts.operation.IsSimpleOp.prototype.isClosedEndpointsInInterior = true;


/**
 * @type {jsts.geom.Coordinate}
 */
jsts.operation.IsSimpleOp.prototype.nonSimpleLocation = null;


/**
 * Creates a simplicity checker using the default SFS Mod-2 Boundary Node Rule
 *
 * @param {Geometry}
 *          geom the geometry to test.
 */
jsts.operation.IsSimpleOp.prototype.IsSimpleOp = function(geom) {
  this.geom = geom;
};


/**
 * Tests whether the geometry is simple.
 *
 * @return {boolean} true if the geometry is simple.
 */
jsts.operation.IsSimpleOp.prototype.isSimple = function() {
  this.nonSimpleLocation = null;
  if (this.geom instanceof jsts.geom.LineString) {
    return this.isSimpleLinearGeometry(this.geom);
  }
  if (this.geom instanceof jsts.geom.MultiLineString) {
    return this.isSimpleLinearGeometry(this.geom);
  }
  if (this.geom instanceof jsts.geom.MultiPoint) {
    return this.isSimpleMultiPoint(this.geom);
  }
  // all other geometry types are simple by definition
  return true;
};


/**
 * @param {MultiPoint}
 *          mp
 * @return {boolean} true if the geometry is simple.
 * @private
 */
jsts.operation.IsSimpleOp.prototype.isSimpleMultiPoint = function(mp) {
  if (mp.isEmpty())
    return true;
  var points = [];
  for (var i = 0; i < mp.getNumGeometries(); i++) {
    var pt = mp.getGeometryN(i);
    var p = pt.getCoordinate();
    for (var j = 0; j < points.length; j++) {
      var point = points[j];
      if (p.equals2D(point)) {
        this.nonSimpleLocation = p;
        return false;
      }
    }
    points.push(p);
  }
  return true;
};


/**
 * @param {Geometry}
 *          geom input geometry.
 * @return {boolean} true if the geometry is simple.
 * @private
 */
jsts.operation.IsSimpleOp.prototype.isSimpleLinearGeometry = function(geom) {
  if (geom.isEmpty())
    return true;
  var graph = new jsts.geomgraph.GeometryGraph(0, geom);
  var li = new jsts.algorithm.RobustLineIntersector();
  var si = graph.computeSelfNodes(li, true);
  // if no self-intersection, must be simple
  if (!si.hasIntersection())
    return true;
  if (si.hasProperIntersection()) {
    this.nonSimpleLocation = si.getProperIntersectionPoint();
    return false;
  }
  if (this.hasNonEndpointIntersection(graph))
    return false;
  if (this.isClosedEndpointsInInterior) {
    if (this.hasClosedEndpointIntersection(graph))
      return false;
  }
  return true;
};


/**
 * For all edges, check if there are any intersections which are NOT at an
 * endpoint. The Geometry is not simple if there are intersections not at
 * endpoints.
 *
 * @param {GeometryGraph}
 *          graph
 * @return {boolean}
 * @private
 */
jsts.operation.IsSimpleOp.prototype.hasNonEndpointIntersection = function(graph) {
  for (var i = 0; i < graph.edges.length; i++) {
    var e = graph.edges[i];
    var maxSegmentIndex = e.getMaximumSegmentIndex();
    var eis = e.eiList.getSortedIntersections();
    for (j = 0; j < eis.length; j++) {
      ei = eis[j];
      if (!ei.isEndPoint(maxSegmentIndex)) {
        this.nonSimpleLocation = ei.getCoordinate();
        return true;
      }
    }
  }
  return false;
};


/**
 * Tests that no edge intersection is the endpoint of a closed line. This
 * ensures that closed lines are not touched at their endpoint, which is an
 * interior point according to the Mod-2 rule To check this we compute the
 * degree of each endpoint. The degree of endpoints of closed lines must be
 * exactly 2.
 *
 * @param {GeometryGraph}
 *          graph
 * @return {boolean}
 * @private
 */
jsts.operation.IsSimpleOp.prototype.hasClosedEndpointIntersection = function(
    graph) {
  // NOTE: TreeMap replaced by array of objects
  var endPoints = [];

  for (var i = 0; i < graph.edges.length; i++) {
    var e = graph.edges[i];
    var maxSegmentIndex = e.getMaximumSegmentIndex();
    var isClosed = e.isClosed();
    var p0 = e.getCoordinate(0);
    this.addEndpoint(endPoints, p0, isClosed);
    var p1 = e.getCoordinate(e.getNumPoints() - 1);
    this.addEndpoint(endPoints, p1, isClosed);
  }

  for (var i = 0; i < endPoints.length; i++) {
    var eiInfo = endPoints[i].ei;
    if (eiInfo.isClosed && eiInfo.degree != 2) {
      this.nonSimpleLocation = eiInfo.getCoordinate();
      return true;
    }
  }
  return false;
};



/**
 * private
 *
 * @constructor
 */
jsts.operation.IsSimpleOp.EndpointInfo = function(pt) {

  this.pt = pt;
  this.isClosed = false;
  this.degree = 0;
};


/**
 * @type {Coordinate}
 * @private
 */
jsts.operation.IsSimpleOp.EndpointInfo.prototype.pt = null;


/**
 * @type {boolean}
 * @private
 */
jsts.operation.IsSimpleOp.EndpointInfo.prototype.isClosed = null;


/**
 * @type {int}
 * @private
 */
jsts.operation.IsSimpleOp.EndpointInfo.prototype.degree = null;


/**
 * @return {Coordinate}
 */
jsts.operation.IsSimpleOp.EndpointInfo.prototype.getCoordinate = function() {
  return this.pt;
};


/**
 * @param {boolean}
 *          isClosed
 */
jsts.operation.IsSimpleOp.EndpointInfo.prototype.addEndpoint = function(
    isClosed) {
  this.degree++;
  this.isClosed = this.isClosed || isClosed;
};


/**
 * Add an endpoint to the map, creating an entry for it if none exists
 *
 * @param {[]}
 *          endPoints
 * @param {Coordinate}
 *          p
 * @param {boolean}
 *          isClosed
 * @private
 */
jsts.operation.IsSimpleOp.prototype.addEndpoint = function(endPoints, p,
    isClosed) {
  var eiInfo = null;

  for (var i = 0; i < endPoints.length; i++) {
    var endPoint = endPoints[i];
    if (endPoint.p.equals2D(p)) {
      eiInfo = endPoint.ei;
    }
  }

  if (eiInfo === null) {
    eiInfo = new jsts.operation.IsSimpleOp.EndpointInfo(p);
    endPoints.push({
      p: p,
      ei: eiInfo
    });
  }

  eiInfo.addEndpoint(isClosed);
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


/**
 * buffer namespace
 */
jsts.operation.buffer = {};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Builds the buffer geometry for a given input geometry and precision model.
 * Allows setting the level of approximation for circular arcs, and the
 * precision model in which to carry out the computation.
 * <p>
 * When computing buffers in floating point double-precision it can happen that
 * the process of iterated noding can fail to converge (terminate). In this case
 * a TopologyException will be thrown. Retrying the computation in a fixed
 * precision can produce more robust results.
 *
 * @param {jsts.operation.buffer.BufferParameters}
 *          bufParams
 * @constructor
 */
jsts.operation.buffer.BufferBuilder = function(bufParams) {
  this.bufParams = bufParams;
};

jsts.operation.buffer.BufferBuilder.prototype.buffer = function() {
  throw new jsts.error.NotImplementedError();
};

// TODO: port rest of class

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Computes the buffer of a geometry, for both positive and negative buffer
 * distances.
 *
 * In GIS, the positive buffer of a geometry is defined as
 * the Minkowski sum or difference of the geometry
 * with a circle of radius equal to the absolute value of the buffer distance.
 * In the CAD/CAM world buffers are known as </i>offset curves</i>.
 * In morphological analysis they are known as <i>erosion</i> and
 * <i>dilation</i>
 *
 * The buffer operation always returns a polygonal result.
 * The negative or zero-distance buffer of lines and points is always an empty
 * {@link Polygon}.
 *
 * Since true buffer curves may contain circular arcs,
 * computed buffer polygons can only be approximations to the true geometry.
 * The user can control the accuracy of the curve approximation by specifying
 * the number of linear segments used to approximate curves.
 *
 * The <b>end cap style</b> of a linear buffer may be specified. The
 * following end cap styles are supported:
 * <ul
 * <li>{@link #CAP_ROUND} - the usual round end caps
 * <li>{@link #CAP_BUTT} - end caps are truncated flat at the line ends
 * <li>{@link #CAP_SQUARE} - end caps are squared off at the buffer distance
 * beyond the line ends
 * </ul>
 *
 */



/**
 * Initializes a buffer computation for the given geometry with the given set of
 * parameters.
 *
 * @param {Geometry}
 *          g the geometry to buffer.
 * @param {BufferParameters}
 *          bufParams the buffer parameters to use.
 * @constructor
 */
jsts.operation.buffer.BufferOp = function(g, bufParams) {
  this.argGeom = g;
  this.bufParams = bufParams ? bufParams
      : new jsts.operation.buffer.BufferParameters();
};


/**
 * A number of digits of precision which leaves some computational "headroom"
 * for floating point operations.
 *
 * This value should be less than the decimal precision of double-precision
 * values (16).
 *
 * @type {int}
 */
jsts.operation.buffer.BufferOp.MAX_PRECISION_DIGITS = 12;


/**
 * Compute a scale factor to limit the precision of a given combination of
 * Geometry and buffer distance. The scale factor is determined by a combination
 * of the number of digits of precision in the (geometry + buffer distance),
 * limited by the supplied <code>maxPrecisionDigits</code> value.
 *
 * @param {Geometry}
 *          g the Geometry being buffered.
 * @param {double}
 *          distance the buffer distance.
 * @param {int}
 *          maxPrecisionDigits the max # of digits that should be allowed by the
 *          precision determined by the computed scale factor.
 *
 * @return {double} a scale factor for the buffer computation.
 */
jsts.operation.buffer.BufferOp.precisionScaleFactor = function(g, distance,
    maxPrecisionDigits) {
  var env = g.getEnvelopeInternal();
  var envSize = Math.max(env.getHeight(), env.getWidth());
  var expandByDistance = distance > 0.0 ? distance : 0.0;
  var bufEnvSize = envSize + 2 * expandByDistance;

  // the smallest power of 10 greater than the buffer envelope
  var bufEnvLog10 = (Math.log(bufEnvSize) / Math.log(10) + 1.0);
  var minUnitLog10 = bufEnvLog10 - maxPrecisionDigits;
  // scale factor is inverse of min Unit size, so flip sign of exponent
  var scaleFactor = Math.pow(10.0, -minUnitLog10);
  return scaleFactor;
};


/**
 * Computes the buffer of a geometry for a given buffer distance.
 *
 * @param {Geometry}
 *          g the geometry to buffer.
 * @param {double}
 *          distance the buffer distance.
 * @return {Geometry} the buffer of the input geometry.
 */
jsts.operation.buffer.BufferOp.bufferOp = function(g, distance) {
  var gBuf = new jsts.operation.buffer.BufferOp(g);
  var geomBuf = gBuf.getResultGeometry(distance);
  return geomBuf;
};


/**
 * Computes the buffer for a geometry for a given buffer distance and accuracy
 * of approximation.
 *
 * @param {Geometry}
 *          g the geometry to buffer.
 * @param {double}
 *          distance the buffer distance.
 * @param {BufferParameters}
 *          params the buffer parameters to use.
 * @return {Geometry} the buffer of the input geometry.
 *
 */
jsts.operation.buffer.BufferOp.bufferOp = function(g, distance, params) {
  var bufOp = new jsts.operation.buffer.BufferOp(g, params);
  var geomBuf = bufOp.getResultGeometry(distance);
  return geomBuf;
};


/**
 * Computes the buffer for a geometry for a given buffer distance and accuracy
 * of approximation.
 *
 * @param {Geometry}
 *          g the geometry to buffer.
 * @param {double}
 *          distance the buffer distance.
 * @param {int}
 *          quadrantSegments the number of segments used to approximate a
 *          quarter circle.
 * @return {Geometry} the buffer of the input geometry.
 *
 */
jsts.operation.buffer.BufferOp.bufferOp = function(g, distance,
    quadrantSegments) {
  var bufOp = new jsts.operation.buffer.BufferOp(g);
  bufOp.setQuadrantSegments(quadrantSegments);
  var geomBuf = bufOp.getResultGeometry(distance);
  return geomBuf;
};


/**
 * Computes the buffer for a geometry for a given buffer distance and accuracy
 * of approximation.
 *
 * @param {Geometry}
 *          g the geometry to buffer.
 * @param {double}
 *          distance the buffer distance.
 * @param {int}
 *          quadrantSegments the number of segments used to approximate a
 *          quarter circle.
 * @param {int}
 *          endCapStyle the end cap style to use.
 * @return {Geometry} the buffer of the input geometry.
 *
 */
jsts.operation.buffer.BufferOp.bufferOp = function(g, distance,
    quadrantSegments, endCapStyle) {
  var bufOp = new jsts.operation.buffer.BufferOp(g);
  bufOp.setQuadrantSegments(quadrantSegments);
  bufOp.setEndCapStyle(endCapStyle);
  var geomBuf = bufOp.getResultGeometry(distance);
  return geomBuf;
};


/**
 * @type {Geometry}
 */
jsts.operation.buffer.BufferOp.prototype.argGeom = null;


/**
 * @type {double}
 */
jsts.operation.buffer.BufferOp.prototype.distance = null;


/**
 * @type {BufferParameters}
 */
jsts.operation.buffer.BufferOp.prototype.bufParams = null;


/**
 * @type {Geometry}
 */
jsts.operation.buffer.BufferOp.prototype.resultGeometry = null;


/**
 * Specifies the end cap style of the generated buffer. The styles supported are
 * {@link #CAP_ROUND}, {@link #CAP_BUTT}, and {@link #CAP_SQUARE}. The
 * default is CAP_ROUND.
 *
 * @param {int}
 *          endCapStyle the end cap style to specify.
 */
jsts.operation.buffer.BufferOp.prototype.setEndCapStyle = function(endCapStyle) {
  this.bufParams.setEndCapStyle(endCapStyle);
};


/**
 * Sets the number of segments used to approximate a angle fillet
 *
 * @param {int}
 *          quadrantSegments the number of segments in a fillet for a quadrant.
 */
jsts.operation.buffer.BufferOp.prototype.setQuadrantSegments = function(
    quadrantSegments) {
  this.bufParams.setQuadrantSegments(quadrantSegments);
};


/**
 * Returns the buffer computed for a geometry for a given buffer distance.
 *
 * @param {double}
 *          dist the buffer distance.
 * @return {Geometry} the buffer of the input geometry.
 */
jsts.operation.buffer.BufferOp.prototype.getResultGeometry = function(dist) {
  this.distance = dist;
  this.computeGeometry();
  return resultGeometry;
};

jsts.operation.buffer.BufferOp.prototype.computeGeometry = function() {
  this.bufferOriginalPrecision();
  if (resultGeometry !== null) {
    return;
  }

  var argPM = argGeom.getPrecisionModel();
  if (argPM.getType() === PrecisionModel.FIXED) {
    this.bufferFixedPrecision(argPM);
  } else {
    this.bufferReducedPrecision();
  }
};


jsts.operation.buffer.BufferOp.prototype.bufferReducedPrecision = function() {
  var precDigits;

  // try and compute with decreasing precision
  for (precDigits = MAX_PRECISION_DIGITS; precDigits >= 0; precDigits--) {
    try {
      this.bufferReducedPrecision(precDigits);
    } catch (/* TopologyException */ex) {
      saveException = ex;
      // don't propagate the exception - it will be detected by fact that
      // resultGeometry is null
    }
    if (resultGeometry !== null) {
      return;
    }
  }

  // tried everything - have to bail
  throw saveException;
};


jsts.operation.buffer.BufferOp.prototype.bufferOriginalPrecision = function() {
  // use fast noding by default
  var bufBuilder = new jsts.operation.buffer.BufferBuilder(this.bufParams);
  resultGeometry = bufBuilder.buffer(this.argGeom, this.distance);
};


/**
 * @param {int}
 *          precisionDigits
 */
jsts.operation.buffer.BufferOp.prototype.bufferReducedPrecision = function(
    precisionDigits) {

  var sizeBasedScaleFactor = this.precisionScaleFactor(argGeom, distance,
      precisionDigits);

  var fixedPM = new jsts.geom.PrecisionModel(sizeBasedScaleFactor);
  this.bufferFixedPrecision(fixedPM);
};


/**
 * @param {PrecisionModel}
 *          fixedPM
 */
jsts.operation.buffer.BufferOp.prototype.bufferFixedPrecision = function(
    fixedPM) {
  var noder = new ScaledNoder(new MCIndexSnapRounder(new PrecisionModel(1.0)),
      fixedPM.getScale());

  var bufBuilder = new jsts.operation.buffer.BufferBuilder(bufParams);
  bufBuilder.setWorkingPrecisionModel(fixedPM);
  bufBuilder.setNoder(noder);
  // this may throw an exception, if robustness errors are encountered
  resultGeometry = bufBuilder.buffer(argGeom, distance);
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


/**
 * Contains the parameters which describe how a buffer should be constructed.
 */
jsts.operation.buffer.BufferParameters = function() {

};


/**
 * Specifies a round line buffer end cap style.
 *
 * @type {int}
 */
jsts.operation.buffer.BufferParameters.CAP_ROUND = 1;


/**
 * Specifies a flat line buffer end cap style.
 *
 * @type {int}
 */
jsts.operation.buffer.BufferParameters.CAP_FLAT = 2;


/**
 * Specifies a square line buffer end cap style.
 *
 * @type {int}
 */
jsts.operation.buffer.BufferParameters.CAP_SQUARE = 3;


/**
 * Specifies a round join style.
 *
 * @type {int}
 */
jsts.operation.buffer.BufferParameters.JOIN_ROUND = 1;


/**
 * Specifies a mitre join style.
 */
jsts.operation.buffer.BufferParameters.JOIN_MITRE = 2;


/**
 * Specifies a bevel join style.
 *
 * @type {int}
 */
jsts.operation.buffer.BufferParameters.OIN_BEVEL = 3;


/**
 * The default number of facets into which to divide a fillet of 90 degrees. A
 * value of 8 gives less than 2% max error in the buffer distance. For a max
 * error of < 1%, use QS = 12. For a max error of < 0.1%, use QS = 18.
 *
 * @type {int}
 */
jsts.operation.buffer.BufferParameters.DEFAULT_QUADRANT_SEGMENTS = 8;


/**
 * The default mitre limit Allows fairly pointy mitres.
 *
 * @type {double}
 */
jsts.operation.buffer.BufferParameters.DEFAULT_MITRE_LIMIT = 5.0;


/**
 * @type {int}
 * @private
 */
jsts.operation.buffer.BufferParameters.prototype.quadrantSegments = jsts.operation.buffer.BufferParameters.DEFAULT_QUADRANT_SEGMENTS;


/**
 * @type {int}
 * @private
 */
jsts.operation.buffer.BufferParameters.prototype.endCapStyle = jsts.operation.buffer.BufferParameters.CAP_ROUND;


/**
 * @type {int}
 * @private
 */
jsts.operation.buffer.BufferParameters.prototype.joinStyle = jsts.operation.buffer.BufferParameters.JOIN_ROUND;


/**
 * @type {double}
 * @private
 */
jsts.operation.buffer.BufferParameters.prototype.mitreLimit = jsts.operation.buffer.BufferParameters.DEFAULT_MITRE_LIMIT;


/**
 * Specifies the end cap style of the generated buffer. The styles supported are
 * {@link #CAP_ROUND}, {@link #CAP_BUTT}, and {@link #CAP_SQUARE}. The
 * default is CAP_ROUND.
 *
 * @param {int}
 *          endCapStyle the end cap style to specify.
 */
jsts.operation.buffer.BufferParameters.prototype.setEndCapStyle = function(
    endCapStyle) {
  this.endCapStyle = endCapStyle;
};


/**
 * Sets the number of segments used to approximate a angle fillet
 *
 * @param {int}
 *          quadrantSegments the number of segments in a fillet for a quadrant.
 */
jsts.operation.buffer.BufferParameters.prototype.setQuadrantSegments = function(
    quadrantSegments) {
  this.quadrantSegments = quadrantSegments;
};


// TODO: port rest of class...

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


/**
 * buffer namespace
 */
jsts.operation.union = {};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */
/**
 * Provides an efficient method of unioning a collection of
 * {@link Polygonal} geometrys.
 * This algorithm is faster and likely more robust than
 * the simple iterated approach of
 * repeatedly unioning each polygon to a result geometry.
 * <p>
 * The <tt>buffer(0)</tt> trick is sometimes faster, but can be less robust and
 * can sometimes take an exceptionally long time to complete.
 * This is particularly the case where there is a high degree of overlap
 * between the polygons.  In this case, <tt>buffer(0)</tt> is forced to compute
 * with <i>all</i> line segments from the outset,
 * whereas cascading can eliminate many segments
 * at each stage of processing.
 * The best case for buffer(0) is the trivial case
 * where there is <i>no</i> overlap between the input geometries.
 * However, this case is likely rare in practice.
 *
 */


/**
 * Creates a new instance to union
 * the given collection of {@link Geometry}s.
 *
 * @param {Geometry[]} geoms a collection of {@link Polygonal} {@link Geometry}s.
 */
jsts.operation.union.CascadedPolygonUnion = function(polys) {

};


/**
 * Computes the union of
 * a collection of {@link Polygonal} {@link Geometry}s.
 *
 * @param {Geometry[]} polys a collection of {@link Polygonal} {@link Geometry}s.
 * @return {Geometry}
 */
jsts.operation.union.CascadedPolygonUnion.union = function(polys) {

};


/**
 * @type {Geometry[]}
 */
jsts.operation.union.CascadedPolygonUnion.prototype.inputPolys;


/**
 * @type {GeometryFactory}
 */
jsts.operation.union.CascadedPolygonUnion.prototype.geomFactory = null;


/**
 * The effectiveness of the index is somewhat sensitive
 * to the node capacity.
 * Testing indicates that a smaller capacity is better.
 * For an STRtree, 4 is probably a good number (since
 * this produces 2x2 "squares").
 *
 * @type {int}
 */
jsts.operation.union.CascadedPolygonUnion.prototype.STRTREE_NODE_CAPACITY = 4;


/**
 * Computes the union of the input geometries.
 *
 * @return {Geometry} the union of the input geometries.
 * @return {null} null if no input geometries were provided.
 */
jsts.operation.union.CascadedPolygonUnion.prototype.union = function() {

};


/**
 *
 * @param {Geometry[]} geomTree
 * @return {Geometry}
 * @private
 */
jsts.operation.union.CascadedPolygonUnion.prototype.unionTree = function(geomTree) {

};


/**
 * Unions a list of geometries
 * by treating the list as a flattened binary tree,
 * and performing a cascaded union on the tree.
 *
 * Unions a section of a list using a recursive binary union on each half
 * of the section.
 * @param {Geometry[]} geoms
 * @param {int} start
 * @param {int} end
 * @return {Geometry} the union of the list section.

 */
jsts.operation.union.CascadedPolygonUnion.prototype.binaryUnion = function(geoms, start, end) {
  start = start || 0;
  end = end || geoms.length;

};


/**
 *
 * @param {Geometry[]} list
 * @param {int} index
 * @return {Geometry}
 * @private
 */
jsts.operation.union.CascadedPolygonUnion.getGeometry = function(list, index) {

};


/**
 * Reduces a tree of geometries to a list of geometries
 * by recursively unioning the subtrees in the list.
 *
 * @param {Geometry[]} geomTree a tree-structured list of geometries.
 * @return {Geometry[]} a list of Geometrys.
 */
jsts.operation.union.CascadedPolygonUnion.prototype.reduceToGeometries = function(geomTree) {

};


/**
 * Computes the union of two geometries,
 * either of both of which may be null.
 *
 * @param {Geometry} g0 a Geometry.
 * @param {Geometry} g1 a Geometry.
 * @return {Geometry} the union of the input(s).
 * @return {null} null if both inputs are null.
 * @private
 */
jsts.operation.union.CascadedPolygonUnion.prototype.unionSafe = function(g0, g1) {

};


/**
 * @param {Geometry} g0 a Geometry.
 * @param {Geometry} g1 a Geometry.
 * @return {Geometry} the union of the input(s).
 * @private
 */
jsts.operation.union.CascadedPolygonUnion.prototype.unionOptimized = function(g0, g1) {

};


/**
 * Unions two polygonal geometries.
 * The case of MultiPolygons is optimized to union only
 * the polygons which lie in the intersection of the two geometry's envelopes.
 * Polygons outside this region can simply be combined with the union result,
 * which is potentially much faster.
 * This case is likely to occur often during cascaded union, and may also
 * occur in real world data (such as unioning data for parcels on different street blocks).
 *
 * @param {Geometry} g0 a polygonal geometry.
 * @param {Geometry} g1 a polygonal geometry.
 * @param {Envelope} common the intersection of the envelopes of the inputs.
 * @return {Geometry} the union of the inputs.
 * @private
 */
jsts.operation.union.CascadedPolygonUnion.prototype.unionUsingEnvelopeIntersection = function(g0, g1, common) {

};


/**
 *
 * @param {Envelope} env
 * @param {Geometry} geom
 * @param {Geometry[]} disjointGeoms
 * @return {Geometry}
 * @private
 */
jsts.operation.union.CascadedPolygonUnion.prototype.extractByEnvelope = function(env, geom, disjointGeoms) {

};


/**
 * Encapsulates the actual unioning of two polygonal geometries.
 *
 * @param {Geometry} g0
 * @param {Geometry} g1
 * @return {Geometry}
 * @private
 */
jsts.operation.union.CascadedPolygonUnion.prototype.unionActual = function(g0, g1) {

};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */
/**
 * Computes the union of a {@link Puntal} geometry with
 * another arbitrary {@link Geometry}.
 * Does not copy any component geometries.
 */


/**
 * @param {Puntal} pointGeom
 * @param {Geometry} otherGeom
 */
jsts.operation.union.PointGeometryUnion = function(pointGeom, otherGeom) {

};


/**
 * @param {Puntal} pointGeom
 * @param {Geometry} otherGeom
 * @return {Geometry}
 */
jsts.operation.union.PointGeometryUnion.union = function(pointGeom, otherGeom) {

};


/**
 * @type {Geometry}
 * @private
 */
jsts.operation.union.PointGeometryUnion.prototype.pointGeom;


/**
 * @type {Geometry}
 * @private
 */
jsts.operation.union.PointGeometryUnion.prototype.otherGeom;


/**
 * @type {GeometryFactory}
 * @private
 */
jsts.operation.union.PointGeometryUnion.prototype.geomFact;


/**
 *
 * @return {Geometry}
 */
jsts.operation.union.PointGeometryUnion.prototype.union = function() {

};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */
/**
 * Unions a collection of Geometry or a single Geometry
 * (which may be a collection) together.
 * By using this special-purpose operation over a collection of geometries
 * it is possible to take advantage of various optimizations to improve performance.
 * Heterogeneous {@link GeometryCollection}s are fully supported.
 * <p>
 * The result obeys the following contract:
 * <ul>
 * <li>Unioning a set of overlapping {@link Polygons}s has the effect of
 * merging the areas (i.e. the same effect as
 * iteratively unioning all individual polygons together).
 *
 * <li>Unioning a set of {@link LineString}s has the effect of <b>fully noding</b>
 * and <b>dissolving</b> the input linework.
 * In this context "fully noded" means that there will be a node or endpoint in the output
 * for every endpoint or line segment crossing in the input.
 * "Dissolved" means that any duplicate (e.g. coincident) line segments or portions
 * of line segments will be reduced to a single line segment in the output.
 * This is consistent with the semantics of the
 * {@link Geometry#union(Geometry)} operation.
 * If <b>merged</b> linework is required, the {@link LineMerger} class can be used.
 *
 * <li>Unioning a set of {@link Points}s has the effect of merging
 * al identical points (producing a set with no duplicates).
 * </ul>
 *
 * <tt>UnaryUnion</tt> always operates on the individual components of MultiGeometries.
 * So it is possible to use it to "clean" invalid self-intersecting MultiPolygons
 * (although the polygon components must all still be individually valid.)
 *
 */



/**
 *
 * @param {Geometry|Geometry[]} geoms  a Geometry or Geometry collection.
 * @param {GeometryFactory} gemFact a GeometryFactory.
 * @constructor
 */
jsts.operation.union.UnaryUnionOp = function(geoms, gemFact) {
  if(gemFact)
  this.geomFact = geomFact;
  else
  this.geomFact = null;
  this.extract(geoms);
};


/**
 *
 * @param {Geometry|Geometry[]} geoms a Geometry or Geometry collection.
 * @param {Geometryfactory} [gemFact] a GeometryFactory.
 * @return {Geometry}
 */
jsts.operation.union.UnaryUnionOp.union = function(geoms, gemFact) {
  var op = new jsts.operation.union.UnaryUnionOp(geoms, gemFact);
  return op.union();
};


/**
 * @type {Polygon[]}
 */
jsts.operation.union.UnaryUnionOp.prototype.polygons = [];


/**
 * @type {Line[]}
 */
jsts.operation.union.UnaryUnionOp.prototype.lines = [];


/**
 * @type {Point[]}
 */
jsts.operation.union.UnaryUnionOp.prototype.points = [];


/**
 * @type {GeometryFactory}
 */
jsts.operation.union.UnaryUnionOp.prototype.geomFact = null;


/**
 * @param {Geometry|Geometry[]} geoms a Geometry or Geometry collection.
 */
jsts.operation.union.UnaryUnionOp.prototype.extract = function(geoms) {
  if (geoms instanceof Array) {
    for (var i = 0, l = geoms.length; i < l; i++) {
      this.extract(geoms[i]);
    }
  }
  else {
    if (this.geomFact === null) {
      geomFact = geoms.getFactory();
    }
    jsts.geom.util.GeometryExtractor.extract(geoms, jsts.geom.Polygon, this.polygons);
    jsts.geom.util.GeometryExtractor.extract(geoms, jsts.geom.LineString, this.lines);
    jsts.geom.util.GeometryExtractor.extract(geoms, jsts.geom.Point, this.points);
  }
};


/**
 * Gets the union of the input geometries.
 * If no input geometries were provided, a POINT EMPTY is returned.
 *
 * @return {Geometry} a Geometry containing the union.
 * @return {GeomatryCollection} an empty GEOMETRYCOLLECTION if no geometries were provided in the input.
 */
jsts.operation.union.UnaryUnionOp.prototype.union = function() {
  if (this.geomFact === null) {
    return null;
  }

  /**
   * For points and lines, only a single union operation is
   * required, since the OGC model allowings self-intersecting
   * MultiPoint and MultiLineStrings.
   * This is not the case for polygons, so Cascaded Union is required.
   */

  var unionPoints = null;
  if (this.points.length > 0) {
    var ptGeom = this.geomFact.buildGeometry(this.points);
    unionPoints = this.unionNoOpt(ptGeom);
  }

  var unionLines = null;
  if (this.lines.length > 0) {
    var lineGeom = this.geomFact.buildGeometry(this.lines);
    unionLines = this.unionNoOpt(lineGeom);
  }

  var unionPolygons = null;
  if (this.polygons.length > 0) {
    unionPolygons = jsts.operation.union.CascadedPolygonUnion.union(this.polygons);
  }

  /**
   * Performing two unions is somewhat inefficient,
   * but is mitigated by unioning lines and points first
   */

  var unionLA = this.unionWithNull(unionLines, unionPolygons);
  var union = null;
  if (unionPoints === null) {
    union = unionLA;
  }
  else if (unionLA === null) {
    union = unionPoints;
  }
  else {
    union = jsts.operation.union.PointGeometryUnion(unionPoints, unionLA);
  }

  if (union === null) {
    return this.geomFact.createGeometryCollection(null);
  }

  return union;
};


/**
 * Computes the union of two geometries,
 * either of both of which may be null.
 *
 * @param {Geometry} g0 a Geometry.
 * @param {Geometry} g1 a Geometry.
 * @return {Geometry} the union of the input(s).
 * @return {null} null if both inputs are null.
 * @private
 */
jsts.operation.union.UnaryUnionOp.prototype.unionWithNull = function(g0, g1) {
  if (g0 === null && g1 === null) {
    return null;
  }
  if (g1 == null) {
    return g0;
  }
  if (g0 === null) {
    return g1;
  }
  return g0.union(g1);
};


/**
 * Computes a unary union with no extra optimization,
 * and no short-circuiting.
 * Due to the way the overlay operations
 * are implemented, this is still efficient in the case of linear
 * and puntal geometries.
 *
 * @param {Geometry} g0
 * @return the union of the input geometry.
 * @private
 */
jsts.operation.union.UnaryUnionOp.prototype.untionNoOpt = function(g0) {

};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Experimental code to union MultiPolygons
 * with processing limited to the elements which actually interact.
 *
 * Not currently used, since it doesn't seem to offer much of a performance advantage.
 *
 */


/**
 * @param {Geometry} g0
 * @param {Geometry} g1
 */
jsts.operation.union.UnionInteracting = function(g0, g1) {

};


/**
 * @param {Geometry} g0
 * @param {Geometry} g1
 * @return {Geometry}
 */
jsts.operation.union.UnionInteracting.union = function(g0, g1) {

};


/**
 * @type {GeometryFactory}
 */
jsts.operation.union.UnionInteracting.prototype.geomFactory;


/**
 * @type {Geometry}
 */
jsts.operation.union.UnionInteracting.prototype.g0;


/**
 * @type {Geometry}
 */
jsts.operation.union.UnionInteracting.prototype.g1;


/**
 * @type {Boolean[]}
 */
jsts.operation.union.UnionInteracting.prototype.interacts0;


/**
 * @type {Boolean[]}
 */
jsts.operation.union.UnionInteracting.prototype.interacts1;


/**
 * @return {Geometry}
 */
jsts.operation.union.UnionInteracting.prototype.union = function() {

};


/**
 * @param {Geometry} g0
 * @param {Geometry} g1
 * @return {Geometry}
 * @private
 */
jsts.operation.union.UnionInteracting.prototype.bufferUnion = function(g0, g1) {

};


/**
 * @param {Geometry} [elem0].
 * @return {void}
 * @return {Boolean}
 * @private
 */
jsts.operation.union.UnionInteracting.prototype.computeInteracting = function(elem0) {

};


/**
 * @param {Geometry} geom
 * @param {Boolean[]} interacts
 * @param {Boolean} isInteracting
 * @return {Geometry}
 * @private
 */
jsts.operation.union.UnionInteracting.prototype.extractElements = function(geom, interacts, isInteracting) {

};


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


/**
 * distance namespace
 */
jsts.operation.distance = {};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geom/GeometryFilter.js
 */



/**
 * A ConnectedElementPointFilter extracts a single point from each connected
 * element in a Geometry (e.g. a polygon, linestring or point) and returns them
 * in a list. The elements of the list are
 * {@link com.vividsolutions.jts.operation.distance.GeometryLocation}s.
 *
 * @param {[]}
 *          locations
 * @augments jsts.geom.GeometryFilter
 * @constructor
 */
jsts.operation.distance.ConnectedElementLocationFilter = function(locations) {
  this.locations = locations;
};

jsts.operation.distance.ConnectedElementLocationFilter.prototype = new jsts.geom.GeometryFilter();


/**
 * @type {[]}
 * @private
 */
jsts.operation.distance.ConnectedElementLocationFilter.prototype.locations = null;


/**
 * Returns a list containing a point from each Polygon, LineString, and Point
 * found inside the specified geometry. Thus, if the specified geometry is not a
 * GeometryCollection, an empty list will be returned. The elements of the list
 * are {@link com.vividsolutions.jts.operation.distance.GeometryLocation}s.
 *
 * @param {Geometry}
 *          geom
 * @return {[]}
 */
jsts.operation.distance.ConnectedElementLocationFilter.getLocations = function(
    geom) {
  var locations = [];
  geom.apply(new jsts.operation.distance.ConnectedElementLocationFilter(
      locations));
  return locations;
};


/**
 * @param {Geometry}
 *          geom
 */
jsts.operation.distance.ConnectedElementLocationFilter.prototype.filter = function(
    geom) {
  if (geom instanceof jsts.geom.Point || geom instanceof jsts.geom.LineString ||
      geom instanceof jsts.geom.Polygon)
    this.locations.push(new jsts.operation.distance.GeometryLocation(geom, 0,
        geom.getCoordinate()));
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */
/**
 * Find two points on two {@link Geometry}s which lie
 * within a given distance, or else are the nearest points
 * on the geometries (in which case this also
 * provides the distance between the geometries).
 * <p>
 * The distance computation also finds a pair of points in the input geometries
 * which have the minimum distance between them.
 * If a point lies in the interior of a line segment,
 * the coordinate computed is a close
 * approximation to the exact point.
 * <p>
 * The algorithms used are straightforward O(n^2)
 * comparisons.  This worst-case performance could be improved on
 * by using Voronoi techniques or spatial indexes.
 *
 */



/**
 * Constructs a DistanceOp that computes the distance and nearest points
 * between the two specified geometries.
 *
 * @param {Geometry}
 *          g0 a Geometry.
 * @param {Geometry}
 *          g1 a Geometry.
 * @param {double}
 *          terminateDistance the distance on which to terminate the search.
 * @constructor
 */
jsts.operation.distance.DistanceOp = function(g0, g1, terminateDistance) {
  this.ptLocator = new jsts.algorithm.PointLocator();

  this.geom = [];
  this.geom[0] = g0;
  this.geom[1] = g1;
  this.terminateDistance = terminateDistance;
};


/**
 * @type {Geometry[]}
 */
jsts.operation.distance.DistanceOp.prototype.geom = null;


/**
 * @type {double}
 */
jsts.operation.distance.DistanceOp.prototype.terminateDistance = 0.0;


/**
 * @type {PointLocator}
 */
jsts.operation.distance.DistanceOp.prototype.ptLocator = null;


/**
 * @type {GeometryLocation[]}
 */
jsts.operation.distance.DistanceOp.prototype.minDistanceLocation = null;


/**
 * @type {double}
 */
jsts.operation.distance.DistanceOp.prototype.minDistance = Number.MAX_VALUE;


/**
 * Compute the distance between the nearest points of two geometries.
 *
 * @param {Geometry}
 *          g0 a {@link Geometry}.
 * @param {Geometry}
 *          g1 another {@link Geometry}.
 * @return {double} the distance between the geometries.
 */
jsts.operation.distance.DistanceOp.distance = function(g0, g1) {
  var distOp = new jsts.operation.distance.DistanceOp(g0, g1, 0.0);
  return distOp.distance();
};


/**
 * Test whether two geometries lie within a given distance of each other.
 *
 * @param {Geometry}
 *          g0 a {@link Geometry}.
 * @param {Geometry}
 *          g1 another {@link Geometry}.
 * @param {double}
 *          distance the distance to test.
 * @return {boolean} true if g0.distance(g1) <= distance.
 */
jsts.operation.distance.DistanceOp.isWithinDistance = function(g0, g1,
    distance) {
  var distOp = new jsts.operation.distance.DistanceOp(g0, g1, distance);
  return distOp.distance() <= distance;
};


/**
 * Compute the the nearest points of two geometries. The points are presented
 * in the same order as the input Geometries.
 *
 * @param {Geometry}
 *          g0 a {@link Geometry}.
 * @param {Geometry}
 *          g1 another {@link Geometry}.
 * @return {Coordinate[]} the nearest points in the geometries.
 */
jsts.operation.distance.DistanceOp.nearestPoints = function(g0, g1) {
  var distOp = new jsts.operation.distance.DistanceOp(g0, g1, 0.0);
  return distOp.nearestPoints();
};


/**
 * Report the distance between the nearest points on the input geometries.
 *
 * @return {double} the distance between the geometries.
 * @return {double} 0 if either input geometry is empty.
 * @throws IllegalArgumentException
 *           if either input geometry is null
 */
jsts.operation.distance.DistanceOp.prototype.distance = function() {
  if (this.geom[0] === null || this.geom[1] === null)
    throw new jsts.error.IllegalArgumentError('null geometries are not supported');
  if (this.geom[0].isEmpty() || this.geom[1].isEmpty())
    return 0.0;

  this.computeMinDistance();
  return this.minDistance;
};


/**
 * Report the coordinates of the nearest points in the input geometries. The
 * points are presented in the same order as the input Geometries.
 *
 * @return {Coordinate[] } a pair of {@link Coordinate} s of the nearest
 *         points.
 */
jsts.operation.distance.DistanceOp.prototype.nearestPoints = function() {
  this.computeMinDistance();
  var nearestPts = [this.minDistanceLocation[0].getCoordinate(),
                    this.minDistanceLocation[1].getCoordinate()];
  return nearestPts;
};


/**
 * Report the locations of the nearest points in the input geometries. The
 * locations are presented in the same order as the input Geometries.
 *
 * @return {GeometryLocation[] } a pair of {@link GeometryLocation} s for the
 *         nearest points.
 */
jsts.operation.distance.DistanceOp.prototype.nearestLocations = function() {
  this.computeMinDistance();
  return this.minDistanceLocation;
};


/**
 * @param {GeometryLocation[]}
 *          locGeom locations.
 * @param {boolean}
 *          flip if locations should be flipped.
 * @private
 */
jsts.operation.distance.DistanceOp.prototype.updateMinDistance = function(
    locGeom, flip) {
  // if not set then don't update
  if (locGeom[0] === null)
    return;

  if (flip) {
    this.minDistanceLocation[0] = locGeom[1];
    this.minDistanceLocation[1] = locGeom[0];
  } else {
    this.minDistanceLocation[0] = locGeom[0];
    this.minDistanceLocation[1] = locGeom[1];
  }
};


/**
 * @private
 */
jsts.operation.distance.DistanceOp.prototype.computeMinDistance = function() {
  // overloaded variant
  if (arguments.length > 0) {
    this.computeMinDistance2.apply(this, arguments);
    return;
  }

  // only compute once!
  if (this.minDistanceLocation !== null)
    return;

  this.minDistanceLocation = [];
  this.computeContainmentDistance();
  if (this.minDistance <= this.terminateDistance)
    return;
  this.computeFacetDistance();
};


/**
 * @private
 */
jsts.operation.distance.DistanceOp.prototype.computeContainmentDistance = function() {
  if (arguments.length === 2) {
    this.computeContainmentDistance2.apply(this, arguments);
    return;
  } else if (arguments.length === 3 && (!arguments[0] instanceof jsts.operation.distance.GeometryLocation)) {
    this.computeContainmentDistance3.apply(this, arguments);
    return;
  } else if (arguments.length === 3) {
    this.computeContainmentDistance4.apply(this, arguments);
    return;
  }

  var locPtPoly = [];
  // test if either geometry has a vertex inside the other
  this.computeContainmentDistance2(0, locPtPoly);
  if (this.minDistance <= this.terminateDistance)
    return;
  this.computeContainmentDistance2(1, locPtPoly);
};


/**
 * @param {int}
 *          polyGeomIndex
 * @param {GeometryLocation[]}
 *          locPtPoly
 * @private
 */
jsts.operation.distance.DistanceOp.prototype.computeContainmentDistance2 = function(
    polyGeomIndex, locPtPoly) {

  var locationsIndex = 1 - polyGeomIndex;
  var polys = jsts.geom.util.PolygonExtracter.getPolygons(this.geom[polyGeomIndex]);
  if (polys.length > 0) {
    var insideLocs = jsts.operation.distance.ConnectedElementLocationFilter
        .getLocations(this.geom[locationsIndex]);
    this.computeContainmentDistance3(insideLocs, polys, locPtPoly);
    if (this.minDistance <= this.terminateDistance) {
      // this assigment is determined by the order of the args in the
      // computeInside call above
      this.minDistanceLocation[locationsIndex] = locPtPoly[0];
      this.minDistanceLocation[polyGeomIndex] = locPtPoly[1];
      return;
    }
  }
};


/**
 * @param {[]}
 *          locs
 * @param {[]}
 *          polys
 * @param {GeometryLocation[] }
 *          locPtPoly
 * @private
 */
jsts.operation.distance.DistanceOp.prototype.computeContainmentDistance3 = function(
    locs, polys, locPtPoly) {

  for (var i = 0; i < locs.length; i++) {
    var loc = locs[i];
    for (var j = 0; j < polys.length; j++) {
      this.computeContainmentDistance4(loc, polys[j], locPtPoly);
      if (this.minDistance <= this.terminateDistance)
        return;
    }
  }
};


/**
 * @param {GeometryLocation}
 *          ptLoc
 * @param {Polygon}
 *          poly
 * @param {GeometryLocation[]} locPtPoly
 * @private
 */
jsts.operation.distance.DistanceOp.prototype.computeContainmentDistance4 = function(
    ptLoc, poly, locPtPoly) {
  var pt = ptLoc.getCoordinate();
  // if pt is not in exterior, distance to geom is 0
  if (jsts.geom.Location.EXTERIOR !== this.ptLocator.locate(pt, poly)) {
    this.minDistance = 0.0;
    locPtPoly[0] = ptLoc;
    locPtPoly[1] = new jsts.operation.distance.GeometryLocation(poly, pt);
    return;
  }
};


/**
 * Computes distance between facets (lines and points) of input geometries.
 * @private
 */
jsts.operation.distance.DistanceOp.prototype.computeFacetDistance = function() {
  var locGeom = [];

  /**
   * Geometries are not wholely inside, so compute distance from lines and
   * points of one to lines and points of the other
   */
  var lines0 = jsts.geom.util.LinearComponentExtracter.getLines(this.geom[0]);
  var lines1 = jsts.geom.util.LinearComponentExtracter.getLines(this.geom[1]);

  var pts0 = jsts.geom.util.PointExtracter.getPoints(this.geom[0]);
  var pts1 = jsts.geom.util.PointExtracter.getPoints(this.geom[1]);

  // exit whenever minDistance goes LE than terminateDistance
  this.computeMinDistanceLines(lines0, lines1, locGeom);
  this.updateMinDistance(locGeom, false);
  if (this.minDistance <= this.terminateDistance)
    return;

  locGeom[0] = null;
  locGeom[1] = null;
  this.computeMinDistanceLinesPoints(lines0, pts1, locGeom);
  this.updateMinDistance(locGeom, false);
  if (this.minDistance <= this.terminateDistance)
    return;

  locGeom[0] = null;
  locGeom[1] = null;
  this.computeMinDistanceLinesPoints(lines1, pts0, locGeom);
  this.updateMinDistance(locGeom, true);
  if (this.minDistance <= this.terminateDistance)
    return;

  locGeom[0] = null;
  locGeom[1] = null;
  this.computeMinDistancePoints(pts0, pts1, locGeom);
  this.updateMinDistance(locGeom, false);
};


/**
 * @param {[]}
 *          lines0.
 * @param {[]}
 *          lines1
 * @param {GeometryLocation[]}
 *          locGeom
 * @private
 */
jsts.operation.distance.DistanceOp.prototype.computeMinDistanceLines = function(
    lines0, lines1, locGeom) {
  for (var i = 0; i < lines0.length; i++) {
    var line0 = lines0[i];
    for (var j = 0; j < lines1.length; j++) {
      var line1 = lines1[j];
      this.computeMinDistance(line0, line1, locGeom);
      if (this.minDistance <= this.terminateDistance)
        return;
    }
  }
};


/**
 * @param {[]}
 *          points0
 * @param {[]}
 *          points1
 * @param {GeometryLocation[]}
 *          locGeom
 * @private
 */
jsts.operation.distance.DistanceOp.prototype.computeMinDistancePoints = function(
    points0, points1, locGeom) {
  for (var i = 0; i < points0.length; i++) {
    var pt0 = points0[i];
    for (var j = 0; j < points1.length; j++) {
      var pt1 = points1[j];
      var dist = pt0.getCoordinate().distance(pt1.getCoordinate());
      if (dist < this.minDistance) {
        this.minDistance = dist;
        locGeom[0] = new jsts.operation.distance.GeometryLocation(pt0, 0, pt0.getCoordinate());
        locGeom[1] = new jsts.operation.distance.GeometryLocation(pt1, 0, pt1.getCoordinate());
      }
      if (this.minDistance <= this.terminateDistance)
        return;
    }
  }
};


/**
 * @param {[]}
 *          lines
 * @param {[]}
 *          points
 * @param {GeometryLocation[]}
 *          locGeom
 * @private
 */
jsts.operation.distance.DistanceOp.prototype.computeMinDistanceLinesPoints = function(
    lines, points, locGeom) {
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    for (var j = 0; j < points.length; j++) {
      var pt = points[j];
      this.computeMinDistance(line, pt, locGeom);
      if (this.minDistance <= this.terminateDistance)
        return;
    }
  }
};


/**
 * @param {LineString}
 *          line0
 * @param {Point}
 *          line1
 * @param {GeometryLocation[]}
 *          locGeom
 * @private
 */
jsts.operation.distance.DistanceOp.prototype.computeMinDistance2 = function(
    line0, line1, locGeom) {

  // overloaded variant
  if (line1 instanceof jsts.geom.Point) {
    this.computeMinDistance3(line0, line1, locGeom);
    return;
  }

  if (line0.getEnvelopeInternal().distance(line1.getEnvelopeInternal()) > this.minDistance) {
    return;
  }
  var coord0 = line0.getCoordinates();
  var coord1 = line1.getCoordinates();
  // brute force approach!
  for (var i = 0; i < coord0.length - 1; i++) {
    for (var j = 0; j < coord1.length - 1; j++) {
      var dist = jsts.algorithm.CGAlgorithms.distanceLineLine(coord0[i], coord0[i + 1],
          coord1[j], coord1[j + 1]);
      if (dist < this.minDistance) {
        this.minDistance = dist;
        var seg0 = new jsts.geom.LineSegment(coord0[i], coord0[i + 1]);
        var seg1 = new jsts.geom.LineSegment(coord1[j], coord1[j + 1]);
        var closestPt = seg0.closestPoints(seg1);
        locGeom[0] = new jsts.operation.distance.GeometryLocation(line0, i, closestPt[0]);
        locGeom[1] = new jsts.operation.distance.GeometryLocation(line1, j, closestPt[1]);
      }
      if (this.minDistance <= this.terminateDistance) {
        return;
      }
    }
  }
};


/**
 * @param {LineString}
 *          line
 * @param {Point}
 *          pt
 * @param {GeometryLocation[]}
 *          locGeom
 * @private
 */
jsts.operation.distance.DistanceOp.prototype.computeMinDistance3 = function(
    line, pt, locGeom) {
  if (line.getEnvelopeInternal().distance(pt.getEnvelopeInternal()) > this.minDistance) {
    return;
  }
  var coord0 = line.getCoordinates();
  var coord = pt.getCoordinate();
  // brute force approach!
  for (var i = 0; i < coord0.length - 1; i++) {
    var dist = jsts.algorithm.CGAlgorithms.distancePointLine(coord, coord0[i], coord0[i + 1]);
    if (dist < this.minDistance) {
      this.minDistance = dist;
      var seg = new jsts.geom.LineSegment(coord0[i], coord0[i + 1]);
      var segClosestPoint = seg.closestPoint(coord);
      locGeom[0] = new jsts.operation.distance.GeometryLocation(line, i, segClosestPoint);
      locGeom[1] = new jsts.operation.distance.GeometryLocation(pt, 0, coord);
    }
    if (this.minDistance <= this.terminateDistance) {
      return;
    }
  }
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Represents the location of a point on a Geometry.
 * Maintains both the actual point location
 * (which may not be exact, if the point is not a vertex)
 * as well as information about the component
 * and segment index where the point occurs.
 * Locations inside area Geometrys will not have an associated segment index,
 * so in this case the segment index will have the sentinel value of
 * {@link #INSIDE_AREA}.
 */



/**
 * Constructs a GeometryLocation specifying a point on a geometry, as well as
 * the segment that the point is on (or {@link INSIDE_AREA} if the point is not
 * on a segment).
 *
 * @param {Geometry}
 *          component the component of the geometry containing the point.
 * @param {int}
 *          segIndex the segment index of the location, or INSIDE_AREA.
 * @param {Coordinate}
 *          pt the coordinate of the location.
 * @constructor
 */
jsts.operation.distance.GeometryLocation = function(component, segIndex, pt) {
  this.component = component;
  this.segIndex = segIndex;
  this.pt = pt;
};


/**
 * A special value of segmentIndex used for locations inside area geometries.
 * These locations are not located on a segment, and thus do not have an
 * associated segment index.
 *
 * @type {int}
 */
jsts.operation.distance.GeometryLocation.INSIDE_AREA = -1;


/**
 * @type {Geometry}
 */
jsts.operation.distance.GeometryLocation.prototype.component = null;


/**
 * @type {int}
 */
jsts.operation.distance.GeometryLocation.prototype.segIndex = null;


/**
 * @type {Coordinate}
 */
jsts.operation.distance.GeometryLocation.prototype.pt = null;


/**
 * @return {Geometry} the geometry component on (or in) which this location
 *         occurs.
 */
jsts.operation.distance.GeometryLocation.prototype.getGeometryComponent = function() {
  return this.component;
};


/**
 * Returns the segment index for this location. If the location is inside an
 * area, the index will have the value {@link INSIDE_AREA};
 *
 * @return {int} the segment index for the location, or INSIDE_AREA.
 */
jsts.operation.distance.GeometryLocation.prototype.getSegmentIndex = function() {
  return this.segIndex;
};


/**
 * @return {Coordinate} the {@link Coordinate} of this location.
 */
jsts.operation.distance.GeometryLocation.prototype.getCoordinate = function() {
  return this.pt;
};


/**
 * @return {boolean} whether this location represents a point inside an area
 *         geometry.
 */
jsts.operation.distance.GeometryLocation.prototype.isInsideArea = function() {
  return this.segIndex === jsts.operation.distance.GeometryLocation.INSIDE_AREA;
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


/**
 * relate namespace
 */
jsts.operation.relate = {};

/* Copyright (c) 2011 by The Authors.



/**
 * An EdgeEndBuilder creates EdgeEnds for all the "split edges"
 * created by the
 * intersections determined for an Edge.
 *
 * Computes the {@link EdgeEnd}s which arise from a noded {@link Edge}.
 *
 * @constructor
 */
jsts.operation.relate.EdgeEndBuilder = function() {

};


jsts.operation.relate.EdgeEndBuilder.prototype.computeEdgeEnds = function(edges) {
  if (arguments.length == 2) {
    this.computeEdgeEnds2.apply(this, arguments);
    return;
  }

  var l = [];
  for (var i = 0; i < edges.length; i++) {
    var e = edges[i];
    this.computeEdgeEnds2(e, l);
  }
  return l;
};


/**
 * Creates stub edges for all the intersections in this Edge (if any) and
 * inserts them into the graph.
 */
jsts.operation.relate.EdgeEndBuilder.prototype.computeEdgeEnds2 = function(edge,
    l) {
  var eiList = edge.getEdgeIntersectionList();
  // ensure that the list has entries for the first and last point of the edge
  eiList.addEndpoints();

  var eis = eiList.getSortedIntersections();

  if (eis.length === 0) return;

  var eiPrev = null;
  var eiCurr = null;
  var eiNext = null;
  for (var i = 0; i < eis.length; i++) {
    eiPrev = eiCurr;
    eiCurr = eis[i];
    eiNext = (i < eis.length - 1) ? eis[i + 1] : null;

    this.createEdgeEndForPrev(edge, l, eiCurr, eiPrev);
    this.createEdgeEndForNext(edge, l, eiCurr, eiNext);
  }

};


/**
 * Create a EdgeStub for the edge before the intersection eiCurr. The previous
 * intersection is provided in case it is the endpoint for the stub edge.
 * Otherwise, the previous point from the parent edge will be the endpoint. <br>
 * eiCurr will always be an EdgeIntersection, but eiPrev may be null.
 *
 * @private
 */
jsts.operation.relate.EdgeEndBuilder.prototype.createEdgeEndForPrev = function(
    edge, l, eiCurr, eiPrev) {

  var iPrev = eiCurr.segmentIndex;
  if (eiCurr.dist === 0.0) {
    // if at the start of the edge there is no previous edge
    if (iPrev === 0)
      return;
    iPrev--;
  }
  var pPrev = edge.getCoordinate(iPrev);
  // if prev intersection is past the previous vertex, use it instead
  if (eiPrev !== null && eiPrev.segmentIndex >= iPrev)
    pPrev = eiPrev.coord;

  var label = new jsts.geomgraph.Label(edge.getLabel());
  // since edgeStub is oriented opposite to it's parent edge, have to flip sides
  // for edge label
  label.flip();
  var e = new jsts.geomgraph.EdgeEnd(edge, eiCurr.coord, pPrev, label);
  // e.print(System.out); System.out.println();
  l.push(e);
};


/**
 * Create a StubEdge for the edge after the intersection eiCurr. The next
 * intersection is provided in case it is the endpoint for the stub edge.
 * Otherwise, the next point from the parent edge will be the endpoint. <br>
 * eiCurr will always be an EdgeIntersection, but eiNext may be null.
 *
 * @private
 */
jsts.operation.relate.EdgeEndBuilder.prototype.createEdgeEndForNext = function(
    edge, l, eiCurr, eiNext) {

  var iNext = eiCurr.segmentIndex + 1;
  // if there is no next edge there is nothing to do
  if (iNext >= edge.getNumPoints() && eiNext === null)
    return;

  var pNext = edge.getCoordinate(iNext);

  // if the next intersection is in the same segment as the current, use it as
  // the endpoint
  if (eiNext !== null && eiNext.segmentIndex === eiCurr.segmentIndex)
    pNext = eiNext.coord;

  var e = new jsts.geomgraph.EdgeEnd(edge, eiCurr.coord, pNext, new jsts.geomgraph.Label(edge.getLabel()));
  l.push(e);
};

/* Copyright (c) 2011 by The Authors.

/**
 * @requires jsts/geomgraph/EdgeEnd.js
 */



/**
 * A collection of {@link EdgeEnd}s which obey the following invariant:
 * They originate at the same node and have the same direction.
 *
 * @augments {jsts.geomgraph.EdgeEnd}
 * @constructor
 */
jsts.operation.relate.EdgeEndBundle = function() {
  this.edgeEnds = [];

  var e = arguments[0] instanceof jsts.geomgraph.EdgeEnd ? arguments[0] : arguments[1];

  var edge = e.getEdge();
  var coord = e.getCoordinate();
  var dirCoord = e.getDirectedCoordinate();
  var label = new jsts.geomgraph.Label(e.getLabel());

  jsts.geomgraph.EdgeEnd.call(this, edge, coord,
      dirCoord, label);

  this.insert(e);
};

jsts.operation.relate.EdgeEndBundle.prototype = new jsts.geomgraph.EdgeEnd();


/**
 * @private
 */
jsts.operation.relate.EdgeEndBundle.prototype.edgeEnds = null;



jsts.operation.relate.EdgeEndBundle.prototype.getLabel = function() {
  return this.label;
};
jsts.operation.relate.EdgeEndBundle.prototype.getEdgeEnds = function() {
  return this.edgeEnds;
};

jsts.operation.relate.EdgeEndBundle.prototype.insert = function(e) {
  // Assert: start point is the same
  // Assert: direction is the same
  this.edgeEnds.push(e);
};


/**
 * This computes the overall edge label for the set of edges in this
 * EdgeStubBundle. It essentially merges the ON and side labels for each edge.
 * These labels must be compatible
 */
jsts.operation.relate.EdgeEndBundle.prototype.computeLabel = function(
    boundaryNodeRule) {
  // create the label. If any of the edges belong to areas,
  // the label must be an area label
  var isArea = false;
  for (var i = 0; i < this.edgeEnds.length; i++) {
    var e = this.edgeEnds[i];
    if (e.getLabel().isArea())
      isArea = true;
  }
  if (isArea)
    this.label = new jsts.geomgraph.Label(jsts.geom.Location.NONE, jsts.geom.Location.NONE,
        jsts.geom.Location.NONE);
  else
    this.label = new jsts.geomgraph.Label(jsts.geom.Location.NONE);

  // compute the On label, and the side labels if present
  for (var i = 0; i < 2; i++) {
    this.computeLabelOn(i, boundaryNodeRule);
    if (isArea)
      this.computeLabelSides(i);
  }
};


/**
 * Compute the overall ON location for the list of EdgeStubs. (This is
 * essentially equivalent to computing the self-overlay of a single Geometry)
 * edgeStubs can be either on the boundary (eg Polygon edge) OR in the interior
 * (e.g. segment of a LineString) of their parent Geometry. In addition,
 * GeometryCollections use a {@link BoundaryNodeRule} to determine whether a
 * segment is on the boundary or not. Finally, in GeometryCollections it can
 * occur that an edge is both on the boundary and in the interior (e.g. a
 * LineString segment lying on top of a Polygon edge.) In this case the Boundary
 * is given precendence. <br>
 * These observations result in the following rules for computing the ON
 * location:
 * <ul>
 * <li> if there are an odd number of Bdy edges, the attribute is Bdy
 * <li> if there are an even number >= 2 of Bdy edges, the attribute is Int
 * <li> if there are any Int edges, the attribute is Int
 * <li> otherwise, the attribute is NULL.
 * </ul>
 *
 * @private
 */
jsts.operation.relate.EdgeEndBundle.prototype.computeLabelOn = function(
    geomIndex, boundaryNodeRule) {
  // compute the ON location value
  var boundaryCount = 0;
  var foundInterior = false;

  for (var i = 0; i < this.edgeEnds.length; i++) {
    var e = this.edgeEnds[i];
    var loc = e.getLabel().getLocation(geomIndex);
    if (loc == jsts.geom.Location.BOUNDARY)
      boundaryCount++;
    if (loc == jsts.geom.Location.INTERIOR)
      foundInterior = true;
  }
  var loc = jsts.geom.Location.NONE;
  if (foundInterior)
    loc = jsts.geom.Location.INTERIOR;
  if (boundaryCount > 0) {
    loc = jsts.geomgraph.GeometryGraph.determineBoundary(boundaryNodeRule,
        boundaryCount);
  }
  this.label.setLocation(geomIndex, loc);

};


/**
 * Compute the labelling for each side
 *
 * @private
 */
jsts.operation.relate.EdgeEndBundle.prototype.computeLabelSides = function(
    geomIndex) {
  this.computeLabelSide(geomIndex, jsts.geomgraph.Position.LEFT);
  this.computeLabelSide(geomIndex, jsts.geomgraph.Position.RIGHT);
};


/**
 * To compute the summary label for a side, the algorithm is: FOR all edges IF
 * any edge's location is INTERIOR for the side, side location = INTERIOR ELSE
 * IF there is at least one EXTERIOR attribute, side location = EXTERIOR ELSE
 * side location = NULL <br>
 * Note that it is possible for two sides to have apparently contradictory
 * information i.e. one edge side may indicate that it is in the interior of a
 * geometry, while another edge side may indicate the exterior of the same
 * geometry. This is not an incompatibility - GeometryCollections may contain
 * two Polygons that touch along an edge. This is the reason for
 * Interior-primacy rule above - it results in the summary label having the
 * Geometry interior on <b>both</b> sides.
 *
 * @private
 */
jsts.operation.relate.EdgeEndBundle.prototype.computeLabelSide = function(
    geomIndex, side) {
  for (var i = 0; i < this.edgeEnds.length; i++) {
    var e = this.edgeEnds[i];
    if (e.getLabel().isArea()) {
      var loc = e.getLabel().getLocation(geomIndex, side);
      if (loc === jsts.geom.Location.INTERIOR) {
        this.label.setLocation(geomIndex, side, jsts.geom.Location.INTERIOR);
        return;
      } else if (loc === jsts.geom.Location.EXTERIOR)
        this.label.setLocation(geomIndex, side, jsts.geom.Location.EXTERIOR);
    }
  }
};


/**
 * Update the IM with the contribution for the computed label for the EdgeStubs.
 *
 * @private
 */
jsts.operation.relate.EdgeEndBundle.prototype.updateIM = function(im) {
  jsts.geomgraph.Edge.updateIM(this.label, im);
};

/* Copyright (c) 2011 by The Authors.

/**
 * @requires jsts/geomgraph/EdgeEndStar.js
 */



/**
 * An ordered list of {@link EdgeEndBundle}s around a {@link RelateNode}.
 * They are maintained in CCW order (starting with the positive x-axis) around the node
 * for efficient lookup and topology building.
 *
 * @constructor
 */
jsts.operation.relate.EdgeEndBundleStar = function() {
  jsts.geomgraph.EdgeEndStar.apply(this, arguments);
};

jsts.operation.relate.EdgeEndBundleStar.prototype = new jsts.geomgraph.EdgeEndStar();


/**
 * Insert a EdgeEnd in order in the list. If there is an existing EdgeStubBundle
 * which is parallel, the EdgeEnd is added to the bundle. Otherwise, a new
 * EdgeEndBundle is created to contain the EdgeEnd. <br>
 */
jsts.operation.relate.EdgeEndBundleStar.prototype.insert = function(e) {
  var eb = this.edgeMap[e];

  if (eb === undefined || !(eb instanceof jsts.operation.relate.EdgeEndBundle)) {
    eb = new jsts.operation.relate.EdgeEndBundle(e);
    this.insertEdgeEnd(e, eb);
  } else {
    eb.insert(e);
  }
};


/**
 * Update the IM with the contribution for the EdgeStubs around the node.
 */
jsts.operation.relate.EdgeEndBundleStar.prototype.updateIM = function(im) {
  var edges = this.getEdges();
  for (var i = 0; i < edges.length; i++) {
    var esb = edges[i];
    esb.updateIM(im);
  }
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Computes the topological relationship between two Geometries.
 * <p>
 * RelateComputer does not need to build a complete graph structure to compute
 * the IntersectionMatrix. The relationship between the geometries can be
 * computed by simply examining the labelling of edges incident on each node.
 * <p>
 * RelateComputer does not currently support arbitrary GeometryCollections. This
 * is because GeometryCollections can contain overlapping Polygons. In order to
 * correct compute relate on overlapping Polygons, they would first need to be
 * noded and merged (if not explicitly, at least implicitly).
 *
 * @constructor
 */
jsts.operation.relate.RelateComputer = function(arg) {
  this.li = new jsts.algorithm.RobustLineIntersector();
  this.ptLocator = new jsts.algorithm.PointLocator();
  this.nodes = new jsts.geomgraph.NodeMap(
      new jsts.operation.relate.RelateNodeFactory());
  this.isolatedEdges = [];

  this.arg = arg;
};


/**
 * @type {LineIntersector}
 * @private
 */
jsts.operation.relate.RelateComputer.prototype.li = null;


/**
 * @type {PointLocator}
 * @private
 */
jsts.operation.relate.RelateComputer.prototype.ptLocator = null;


/**
 * the arg(s) of the operation
 *
 * @type {GeometryGraph[]}
 * @private
 */
jsts.operation.relate.RelateComputer.prototype.arg = null;


/**
 * @type {NodeMap}
 * @private
 */
jsts.operation.relate.RelateComputer.prototype.nodes = null;


/**
 * this intersection matrix will hold the results compute for the relate
 *
 * @type {IntersectionMatrix}
 * @private
 */
jsts.operation.relate.RelateComputer.prototype.im = null;


/**
 * @type {[]}
 * @private
 */
jsts.operation.relate.RelateComputer.prototype.isolatedEdges = null;


/**
 * the intersection point found (if any)
 *
 * @type {Coordinate}
 * @private
 */
jsts.operation.relate.RelateComputer.prototype.invalidPoint = null;


jsts.operation.relate.RelateComputer.prototype.computeIM = function() {
  var im = new jsts.geom.IntersectionMatrix();
  // since Geometries are finite and embedded in a 2-D space, the EE element
  // must always be 2
  im.set(jsts.geom.Location.EXTERIOR, jsts.geom.Location.EXTERIOR, 2);

  // if the Geometries don't overlap there is nothing to do
  if (!this.arg[0].getGeometry().getEnvelopeInternal().intersects(
      this.arg[1].getGeometry().getEnvelopeInternal())) {
    this.computeDisjointIM(im);
    return im;
  }
  this.arg[0].computeSelfNodes(this.li, false);
  this.arg[1].computeSelfNodes(this.li, false);

  // compute intersections between edges of the two input geometries
  var intersector = this.arg[0].computeEdgeIntersections(this.arg[1], this.li, false);
  // System.out.println("computeIM: # segment intersection tests: " +
  // intersector.numTests);
  this.computeIntersectionNodes(0);
  this.computeIntersectionNodes(1);
  /**
   * Copy the labelling for the nodes in the parent Geometries. These override
   * any labels determined by intersections between the geometries.
   */
  this.copyNodesAndLabels(0);
  this.copyNodesAndLabels(1);

  // complete the labelling for any nodes which only have a label for a single
  // geometry
  this.labelIsolatedNodes();

  // If a proper intersection was found, we can set a lower bound on the IM.
  this.computeProperIntersectionIM(intersector, im);

  /**
   * Now process improper intersections (eg where one or other of the geometries
   * has a vertex at the intersection point) We need to compute the edge graph
   * at all nodes to determine the IM.
   */

  // build EdgeEnds for all intersections
  var eeBuilder = new jsts.operation.relate.EdgeEndBuilder();
  var ee0 = eeBuilder.computeEdgeEnds(this.arg[0].getEdges());
  this.insertEdgeEnds(ee0);
  var ee1 = eeBuilder.computeEdgeEnds(this.arg[1].getEdges());
  this.insertEdgeEnds(ee1);

  this.labelNodeEdges();

  /**
   * Compute the labeling for isolated components <br>
   * Isolated components are components that do not touch any other components
   * in the graph. They can be identified by the fact that they will contain
   * labels containing ONLY a single element, the one for their parent geometry.
   * We only need to check components contained in the input graphs, since
   * isolated components will not have been replaced by new components formed by
   * intersections.
   */
  this.labelIsolatedEdges(0, 1);
  this.labelIsolatedEdges(1, 0);

  // update the IM from all components
  this.updateIM(im);
  return im;
};


/**
 * @private
 */
jsts.operation.relate.RelateComputer.prototype.insertEdgeEnds = function(ee) {
  for (var i = 0; i < ee.length; i++) {
    var e = ee[i];
    this.nodes.add(e);
  }
};


/**
 * @private
 */
jsts.operation.relate.RelateComputer.prototype.computeProperIntersectionIM = function(
    intersector, im) {
  // If a proper intersection is found, we can set a lower bound on the IM.
  var dimA = this.arg[0].getGeometry().getDimension();
  var dimB = this.arg[1].getGeometry().getDimension();
  var hasProper = intersector.hasProperIntersection();
  var hasProperInterior = intersector.hasProperInteriorIntersection();

  // For Geometry's of dim 0 there can never be proper intersections.

  /**
   * If edge segments of Areas properly intersect, the areas must properly
   * overlap.
   */
  if (dimA === 2 && dimB === 2) {
    if (hasProper)
      im.setAtLeast('212101212');
  }
  /**
   * If an Line segment properly intersects an edge segment of an Area, it
   * follows that the Interior of the Line intersects the Boundary of the Area.
   * If the intersection is a proper <i>interior</i> intersection, then there
   * is an Interior-Interior intersection too. Note that it does not follow that
   * the Interior of the Line intersects the Exterior of the Area, since there
   * may be another Area component which contains the rest of the Line.
   */
  else if (dimA === 2 && dimB === 1) {
    if (hasProper)
      im.setAtLeast('FFF0FFFF2');
    if (hasProperInterior)
      im.setAtLeast('1FFFFF1FF');
  } else if (dimA === 1 && dimB === 2) {
    if (hasProper)
      im.setAtLeast('F0FFFFFF2');
    if (hasProperInterior)
      im.setAtLeast('1F1FFFFFF');
  }
  /* If edges of LineStrings properly intersect *in an interior point*, all
          we can deduce is that
          the interiors intersect.  (We can NOT deduce that the exteriors intersect,
          since some other segments in the geometries might cover the points in the
          neighbourhood of the intersection.)
          It is important that the point be known to be an interior point of
          both Geometries, since it is possible in a self-intersecting geometry to
          have a proper intersection on one segment that is also a boundary point of another segment.
      */
  else if (dimA === 1 && dimB === 1) {
    if (hasProperInterior)
      im.setAtLeast('0FFFFFFFF');
  }
};


/**
 * Copy all nodes from an arg geometry into this graph. The node label in the
 * arg geometry overrides any previously computed label for that argIndex. (E.g.
 * a node may be an intersection node with a computed label of BOUNDARY, but in
 * the original arg Geometry it is actually in the interior due to the Boundary
 * Determination Rule)
 *
 * @private
 */
jsts.operation.relate.RelateComputer.prototype.copyNodesAndLabels = function(
    argIndex) {
  var nodes = this.arg[argIndex].getNodes();
  for (var i = 0; i < nodes.length; i++) {
    var graphNode = nodes[i];
    var newNode = this.nodes.addNode(graphNode.getCoordinate());
    newNode.setLabel(argIndex, graphNode.getLabel().getLocation(argIndex));
  }
};


/**
 * Insert nodes for all intersections on the edges of a Geometry. Label the
 * created nodes the same as the edge label if they do not already have a label.
 * This allows nodes created by either self-intersections or mutual
 * intersections to be labelled. Endpoint nodes will already be labelled from
 * when they were inserted.
 *
 * @private
 */
jsts.operation.relate.RelateComputer.prototype.computeIntersectionNodes = function(
    argIndex) {
  var edges = this.arg[argIndex].getEdges();
  for (var i = 0; i < edges.length; i++) {
    var e = edges[i];
    var eLoc = e.getLabel().getLocation(argIndex);
    var eis = e.eiList.getSortedIntersections();
    for (var j = 0; j < eis.length; j++) {
      var ei = eis[j];
      var n = this.nodes.addNode(ei.coord);
      if (eLoc === jsts.geom.Location.BOUNDARY)
        n.setLabelBoundary(argIndex);
      else {
        if (n.getLabel().isNull(argIndex))
          n.setLabel(argIndex, jsts.geom.Location.INTERIOR);
      }
    }
  }
};


/**
 * For all intersections on the edges of a Geometry, label the corresponding
 * node IF it doesn't already have a label. This allows nodes created by either
 * self-intersections or mutual intersections to be labelled. Endpoint nodes
 * will already be labelled from when they were inserted.
 *
 * @private
 */
jsts.operation.relate.RelateComputer.prototype.labelIntersectionNodes = function(
    argIndex) {
  var edges = this.arg[argIndex].getEdges();
  for (var i = 0; i < edges.length; i++) {
    var e = edges[i];
    var eLoc = e.getLabel().getLocation(argIndex);
    var eis = e.eiList.getSortedIntersections();
    for (var j = 0; j < eis.length; j++) {
      var ei = eis[j];
      var n = this.nodes.find(ei.coord);
      if (n.getLabel().isNull(argIndex)) {
        if (eLoc === jsts.geom.Location.BOUNDARY)
          n.setLabelBoundary(argIndex);
        else
          n.setLabel(argIndex, jsts.geom.Location.INTERIOR);
      }
    }
  }
};


/**
 * If the Geometries are disjoint, we need to enter their dimension and boundary
 * dimension in the Ext rows in the IM
 *
 * @private
 */
jsts.operation.relate.RelateComputer.prototype.computeDisjointIM = function(im) {
  var ga = this.arg[0].getGeometry();
  if (!ga.isEmpty()) {
    im.set(jsts.geom.Location.INTERIOR, jsts.geom.Location.EXTERIOR, ga
        .getDimension());
    im.set(jsts.geom.Location.BOUNDARY, jsts.geom.Location.EXTERIOR, ga
        .getBoundaryDimension());
  }
  var gb = this.arg[1].getGeometry();
  if (!gb.isEmpty()) {
    im.set(jsts.geom.Location.EXTERIOR, jsts.geom.Location.INTERIOR, gb
        .getDimension());
    im.set(jsts.geom.Location.EXTERIOR, jsts.geom.Location.BOUNDARY, gb
        .getBoundaryDimension());
  }
};


/**
 * @private
 */
jsts.operation.relate.RelateComputer.prototype.labelNodeEdges = function() {
  var nodes = this.nodes.values();
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    node.getEdges().computeLabelling(this.arg);
  }
};


/**
 * update the IM with the sum of the IMs for each component
 *
 * @private
 */
jsts.operation.relate.RelateComputer.prototype.updateIM = function(im) {
  for (var ei = 0; ei < this.isolatedEdges.length; ei++) {
    var e = this.isolatedEdges[ei];
    e.updateIM(im);
  }
  var nodes = this.nodes.values();
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    node.updateIM(im);
    node.updateIMFromEdges(im);
  }
};


/**
 * Processes isolated edges by computing their labelling and adding them to the
 * isolated edges list. Isolated edges are guaranteed not to touch the boundary
 * of the target (since if they did, they would have caused an intersection to
 * be computed and hence would not be isolated)
 *
 * @private
 */
jsts.operation.relate.RelateComputer.prototype.labelIsolatedEdges = function(
    thisIndex, targetIndex) {
  var edges = this.arg[thisIndex].edges;
  for (var i = 0; i < edges.length; i++) {
    var e = edges[i];
    if (e.isIsolated()) {
      this.labelIsolatedEdge(e, targetIndex, this.arg[targetIndex].getGeometry());
      this.isolatedEdges.push(e);
    }
  }
};


/**
 * Label an isolated edge of a graph with its relationship to the target
 * geometry. If the target has dim 2 or 1, the edge can either be in the
 * interior or the exterior. If the target has dim 0, the edge must be in the
 * exterior
 *
 * @private
 */
jsts.operation.relate.RelateComputer.prototype.labelIsolatedEdge = function(e,
    targetIndex, target) {
  // this won't work for GeometryCollections with both dim 2 and 1 geoms
  if (target.getDimension() > 0) {
    // since edge is not in boundary, may not need the full generality of
    // PointLocator?
    // Possibly should use ptInArea locator instead? We probably know here
    // that the edge does not touch the bdy of the target Geometry
    var loc = this.ptLocator.locate(e.getCoordinate(), target);
    e.getLabel().setAllLocations(targetIndex, loc);
  } else {
    e.getLabel().setAllLocations(targetIndex, jsts.geom.Location.EXTERIOR);
  }
};


/**
 * Isolated nodes are nodes whose labels are incomplete (e.g. the location for
 * one Geometry is null). This is the case because nodes in one graph which
 * don't intersect nodes in the other are not completely labelled by the initial
 * process of adding nodes to the nodeList. To complete the labelling we need to
 * check for nodes that lie in the interior of edges, and in the interior of
 * areas.
 *
 * @private
 */
jsts.operation.relate.RelateComputer.prototype.labelIsolatedNodes = function() {
  var nodes = this.nodes.values();
  for (var i = 0; i < nodes.length; i++) {
    var n = nodes[i];
    var label = n.getLabel();
    // isolated nodes should always have at least one geometry in their label
    // Assert.isTrue(label.getGeometryCount() > 0, 'node with empty label
    // found');
    if (n.isIsolated()) {
      if (label.isNull(0))
        this.labelIsolatedNode(n, 0);
      else
        this.labelIsolatedNode(n, 1);
    }
  }
};


/**
 * Label an isolated node with its relationship to the target geometry.
 */
jsts.operation.relate.RelateComputer.prototype.labelIsolatedNode = function(n,
    targetIndex) {
  var loc = this.ptLocator.locate(n.getCoordinate(), this.arg[targetIndex]
      .getGeometry());
  n.getLabel().setAllLocations(targetIndex, loc);
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geomgraph/Node.js
 */



/**
 * A RelateNode is a Node that maintains a list of EdgeStubs for the edges that
 * are incident on it.
 *
 * Represents a node in the topological graph used to compute spatial
 * relationships.
 *
 * @augments {Node}
 * @constructor
 */
jsts.operation.relate.RelateNode = function(coord, edges) {
  jsts.geomgraph.Node.apply(this, arguments);
};

jsts.operation.relate.RelateNode.prototype = new jsts.geomgraph.Node();


/**
 * Update the IM with the contribution for this component. A component only
 * contributes if it has a labelling for both parent geometries
 *
 * @protected
 */
jsts.operation.relate.RelateNode.prototype.computeIM = function(im) {
  im.setAtLeastIfValid(this.label.getLocation(0), this.label.getLocation(1), 0);
};


/**
 * Update the IM with the contribution for the EdgeEnds incident on this node.
 */
jsts.operation.relate.RelateNode.prototype.updateIMFromEdges = function(im) {
  this.edges.updateIM(im);
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Used by the {@link NodeMap} in a {@link RelateNodeGraph} to create
 * {@link RelateNode}s.
 *
 * @augments {jsts.geomgraph.NodeFactory}
 * @constructor
 */
jsts.operation.relate.RelateNodeFactory = function() {

};

jsts.operation.relate.RelateNodeFactory.prototype = new jsts.geomgraph.NodeFactory();

jsts.operation.relate.RelateNodeFactory.prototype.createNode = function(coord) {
  return new jsts.operation.relate.RelateNode(coord,
      new jsts.operation.relate.EdgeEndBundleStar());
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Implements the simple graph of Nodes and EdgeEnd which is all that is
 * required to determine topological relationships between Geometries. Also
 * supports building a topological graph of a single Geometry, to allow
 * verification of valid topology.
 * <p>
 * It is <b>not</b> necessary to create a fully linked PlanarGraph to determine
 * relationships, since it is sufficient to know how the Geometries interact
 * locally around the nodes. In fact, this is not even feasible, since it is not
 * possible to compute exact intersection points, and hence the topology around
 * those nodes cannot be computed robustly. The only Nodes that are created are
 * for improper intersections; that is, nodes which occur at existing vertices
 * of the Geometries. Proper intersections (e.g. ones which occur between the
 * interior of line segments) have their topology determined implicitly, without
 * creating a Node object to represent them.
 *
 * @constructor
 */
jsts.operation.relate.RelateNodeGraph = function() {
  this.nodes = new jsts.geomgraph.NodeMap(
      new jsts.operation.relate.RelateNodeFactory());
};


/**
 * @private
 */
jsts.operation.relate.RelateNodeGraph.prototype.nodes = null;


jsts.operation.relate.RelateNodeGraph.prototype.build = function(geomGraph) {
  // compute nodes for intersections between previously noded edges
  this.computeIntersectionNodes(geomGraph, 0);
  /**
   * Copy the labelling for the nodes in the parent Geometry. These override any
   * labels determined by intersections.
   */
  this.copyNodesAndLabels(geomGraph, 0);

  /**
   * Build EdgeEnds for all intersections.
   */
  var eeBuilder = new EdgeEndBuilder();
  var eeList = eeBuilder.computeEdgeEnds(geomGraph.edges);
  this.insertEdgeEnds(eeList);

  // Debug.println("==== NodeList ===");
  // Debug.print(nodes);
};


/**
 * Insert nodes for all intersections on the edges of a Geometry. Label the
 * created nodes the same as the edge label if they do not already have a label.
 * This allows nodes created by either self-intersections or mutual
 * intersections to be labelled. Endpoint nodes will already be labelled from
 * when they were inserted.
 * <p>
 * Precondition: edge intersections have been computed.
 */
jsts.operation.relate.RelateNodeGraph.prototype.computeIntersectionNodes = function(
    geomGraph, argIndex) {
  var edges = geomGraph.edges;
  for (var i = 0; i < edges.length; i++) {
    var e = edges[i];
    var eLoc = e.getLabel().getLocation(argIndex);
    for (var j = 0; j < e.eiList.length; j++) {
      var ei = e.eiList[j];
      RelateNode;
      n = this.nodes.addNode(ei.coord);
      if (eLoc === Location.BOUNDARY)
        n.setLabelBoundary(argIndex);
      else {
        if (n.getLabel().isNull(argIndex))
          n.setLabel(argIndex, Location.INTERIOR);
      }
      // Debug.println(n);
    }
  }
};


/**
 * Copy all nodes from an arg geometry into this graph. The node label in the
 * arg geometry overrides any previously computed label for that argIndex. (E.g.
 * a node may be an intersection node with a computed label of BOUNDARY, but in
 * the original arg Geometry it is actually in the interior due to the Boundary
 * Determination Rule)
 */
jsts.operation.relate.RelateNodeGraph.prototype.copyNodesAndLabels = function(
    geomGraph, argIndex) {
  var nodes = geomGraph.nodes;
  for (var i = 0; i < nodes.length; i++) {
    var graphNode = nodes[i];
    var newNode = nodes.addNode(graphNode.getCoordinate());
    newNode.setLabel(argIndex, graphNode.getLabel().getLocation(argIndex));
    // node.print(System.out);
  }
};

jsts.operation.relate.RelateNodeGraph.prototype.insertEdgeEnds = function(ee) {
  for (var i = 0; i < ee.length; i++) {
    var e = ee[i];
    this.nodes.add(e);
  }
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Implements the SFS <tt>relate()</tt> operation on two {@link Geometry}s.
 * This class supports specifying a custom {@link BoundaryNodeRule} to be used
 * during the relate computation.
 * <p>
 * <b>Note:</b> custom Boundary Node Rules do not (currently) affect the
 * results of other Geometry methods (such as {@link Geometry#getBoundary}. The
 * results of these methods may not be consistent with the relationship computed
 * by a custom Boundary Node Rule.
 *
 * Creates a new Relate operation with a specified Boundary Node Rule.
 *
 * @param g0
 *          a Geometry to relate.
 * @param g1
 *          another Geometry to relate.
 * @param boundaryNodeRule
 *          the Boundary Node Rule to use.
 *
 * @augments GeometryGraphOperation
 * @constructor
 */
jsts.operation.relate.RelateOp = function() {
  jsts.operation.GeometryGraphOperation.apply(this, arguments);
  this._relate = new jsts.operation.relate.RelateComputer(this.arg);
};

jsts.operation.relate.RelateOp.prototype = new jsts.operation.GeometryGraphOperation();


/**
 * Computes the {@link IntersectionMatrix} for the spatial relationship between
 * two {@link Geometry}s using a specified Boundary Node Rule.
 *
 * @param a
 *          a Geometry to test.
 * @param b
 *          a Geometry to test.
 * @param boundaryNodeRule
 *          the Boundary Node Rule to use.
 * @return the IntersectonMatrix for the spatial relationship between the input
 *         geometries.
 */
jsts.operation.relate.RelateOp.relate = function(a, b, boundaryNodeRule) {
  var relOp = new jsts.operation.relate.RelateOp(a, b, boundaryNodeRule);
  var im = relOp.getIntersectionMatrix();
  return im;
};


/**
 * @type {RelateComputer}
 * @private
 */
jsts.operation.relate.RelateOp.prototype._relate = null;


/**
 * Gets the IntersectionMatrix for the spatial relationship between the input
 * geometries.
 *
 * @return the IntersectonMatrix for the spatial relationship between the input
 *         geometries.
 */
jsts.operation.relate.RelateOp.prototype.getIntersectionMatrix = function() {
  return this._relate.computeIM();
};

