#!/usr/bin/python
# -*- coding: utf-8 -*-
"""
Created on Mon Feb  9 00:02:35 2015

@author: Diego Moreira Carvalho
@email: moreira.geo@gmail.com
"""


import os, sys
import numpy as np
import yaml
from osgeo import gdal, ogr, osr
from skimage.graph import route_through_array


BASE_PATH = os.path.dirname(__file__)
RASTERIZE_COLOR_FIELD = "color"
noDataValue = -9999


INFORMED_PATH_COST = 'informed_path_cost'
CARTESIAN_STRAIGHT_LINE_COST = 'cartesian_straight_line_cost'
BEST_PATH = 'best_path'
BEST_PATH_WITHIN_BUFFER = 'best_path_within_buffer'
BEST_PATH_LUT = 'best_path_lut'

TYPES_CALCULATIONS = [INFORMED_PATH_COST,CARTESIAN_STRAIGHT_LINE_COST, BEST_PATH, 
                      BEST_PATH_WITHIN_BUFFER, BEST_PATH_LUT]

def cleanDirectories():
    dirs = [os.path.join(BASE_PATH,'tmp/raster/'),os.path.join(BASE_PATH,'tmp/shp/')]
    for d in dirs:
        filelist = [ f for f in os.listdir(d) if os.path.isfile(os.path.join(d,f))]
        for f in filelist:
            os.remove(os.path.join(d,f))

def coord2pixelOffset(rasterfn,x,y):
    raster = gdal.Open(rasterfn)
    geotransform = raster.GetGeoTransform()
    originX = geotransform[0]
    originY = geotransform[3]
    pixelWidth = geotransform[1]
    pixelHeight = geotransform[5]
    xOffset = int((x - originX)/pixelWidth)
    yOffset = int((y - originY)/pixelHeight)
    
    return xOffset,yOffset
    
def pixelsOffset2coord(rasterfn,pixels):
    raster = gdal.Open(rasterfn)
    geotransform = raster.GetGeoTransform()
    coords = []
    for lin, col in pixels:
        Xgeo = (geotransform[0] + col*geotransform[1] + lin*geotransform[2] + 
                            (geotransform[1] + lin*geotransform[2])/2)
        Ygeo = (geotransform[3] + lin*geotransform[5] + col*geotransform[4] +
                            (geotransform[5] + col*geotransform[4])/2)
        coords.append([Xgeo,Ygeo])
                            
    return coords    
    
    
def raster2array(rasterfn):
    raster = gdal.Open(rasterfn)
    band = raster.GetRasterBand(1)
    array = band.ReadAsArray()
    return array
    
def array2raster(newRasterfn,rasterfn,array, dataType=None, zeroAsNoData=False):
    raster = gdal.Open(rasterfn)
    band =raster.GetRasterBand(1)
    if not dataType:
        dataType = band.DataType
            
    outRaster = createRaster(rasterfn,newRasterfn, dataType)
    
    outband = outRaster.GetRasterBand(1)
    outband.SetNoDataValue(noDataValue)
    if zeroAsNoData:
        array[array==0] = noDataValue
    outband.WriteArray(array)

    outband.FlushCache()
    return outRaster
    
def createCartesianLineGeom(p0,p1):
    line = ogr.Geometry(ogr.wkbLineString)
    line.AddPoint(p0[0], p0[1])
    line.AddPoint(p1[0], p1[1])
    return line
    
def createCartesianLineStringGeom(points):
    line = ogr.Geometry(ogr.wkbLineString)
    for i in points:
        line.AddPoint(i[0], i[1])
    return line
    
    
def getFirstLine(vectorFilePath):
    driver = ogr.GetDriverByName("ESRI Shapefile")
    dataSource = driver.Open(vectorFilePath, 0)
    layer = dataSource.GetLayer()
    for f in layer:
        geom = f.GetGeometryRef()
        return createCartesianLineStringGeom(geom.GetPoints())

def createShape(path, geom, projection):
    layer_name = os.path.basename(path).split('.')[0]
    drv = ogr.GetDriverByName( "ESRI Shapefile" )  
    dst_ds = drv.CreateDataSource(path)
    if dst_ds:
        print "Failed to create feature in shapefile.\n"
        return False
    
    dst_layer = dst_ds.CreateLayer(str(layer_name), srs=projection, geom_type = geom.GetGeometryType() )  
    field_def = ogr.FieldDefn(RASTERIZE_COLOR_FIELD, ogr.OFTReal)
    dst_layer.CreateField(field_def)
    source_layer_def = dst_layer.GetLayerDefn()      
    field_index = source_layer_def.GetFieldIndex(RASTERIZE_COLOR_FIELD)  
    
    feat = ogr.Feature( source_layer_def)
    feat.SetField(field_index, 1)  
    feat.SetGeometry(geom)
    if dst_layer.CreateFeature(feat) != 0:
        print "Failed to create feature in shapefile.\n"
        return False
    return  True
    

def createRaster(rasterLayerModelPath, outputRasterPath, bandType=gdal.GDT_Byte):
    s_raster = gdal.Open(rasterLayerModelPath)
    s_driver = s_raster.GetDriver()
    
    geotransform = s_raster.GetGeoTransform()
    s_origin_x = geotransform[0]
    s_origin_y = geotransform[3]
    s_pixel_width = geotransform[1]
    s_pixel_height = geotransform[5]
    s_x_rotation = geotransform[2]
    s_y_rotation = geotransform[4]

    s_colls = s_raster.RasterXSize
    s_rows = s_raster.RasterYSize
    target_ds = s_driver.Create(outputRasterPath, s_colls, s_rows, 1, bandType)
    target_ds.SetGeoTransform(( s_origin_x, s_pixel_width, s_x_rotation,
            s_origin_y, s_y_rotation, s_pixel_height,
        ))
    target_ds.SetProjection(s_raster.GetProjectionRef())
    return target_ds

def calculateProximity(src_filename, dst_filename):
    src_ds = gdal.Open( src_filename)
    srcband = src_ds.GetRasterBand(1)
    target_ds = createRaster(src_filename, dst_filename,gdal.GDT_Int32  )
    dstband = target_ds.GetRasterBand(1)    
    options = []    
    options.append( 'DISTUNITS=PIXEL' )
    options.append( 'NODATA=noDataValue')
    gdal.ComputeProximity( srcband, dstband, options)
    target_ds = None

def rasterize(vectorPath, rasterLayerModelPath, outputRasterPath):
    orig_data_source = ogr.Open(vectorPath)

    source_layer = orig_data_source.GetLayer(0)
    
    target_ds = createRaster(rasterLayerModelPath, outputRasterPath)
    # Rasterize
    err = gdal.RasterizeLayer(target_ds, (1,), source_layer,
            burn_values=(0,),
            options=["ATTRIBUTE=%s" % RASTERIZE_COLOR_FIELD,"ALL_TOUCHED=TRUE"])
    if err != 0:
        raise Exception("error rasterizing layer: %s" % err)
        
def lookUpTable(cost_surface_path, new_cost_surface_path, luts):
    costSurfaceArray = raster2array(cost_surface_path)
    for i in luts:
        costSurfaceArray[np.logical_and(costSurfaceArray >= i['min'], costSurfaceArray <= i['max'])] = i['nv']
    array2raster(new_cost_surface_path, cost_surface_path, costSurfaceArray, None, True)

def createPath(cost_surface_path, startCoord,stopCoord):

    costSurfaceArray = raster2array(cost_surface_path)
    # coordinates to array index
    startCoordX = startCoord[0]
    startCoordY = startCoord[1]
    startIndexX,startIndexY = coord2pixelOffset(cost_surface_path,startCoordX,startCoordY)

    stopCoordX = stopCoord[0]
    stopCoordY = stopCoord[1]
    stopIndexX,stopIndexY = coord2pixelOffset(cost_surface_path,stopCoordX,stopCoordY)
    # create path
    indices, weight = route_through_array(costSurfaceArray, 
                                          (startIndexY,startIndexX), 
                                          (stopIndexY,stopIndexX),geometric=True,fully_connected=True)
    indiceT = np.array(indices).T
    path = np.zeros_like(costSurfaceArray)
    path[indiceT[0], indiceT[1]] = 1
    
    return path, indices
    
def calculateCost(item, cost_surface_path, path_result, file_prefix, line, vector_path, raster_path):
    s_raster = gdal.Open(cost_surface_path)
    s_projection = osr.SpatialReference(s_raster.GetProjectionRef())  
    costSurfaceArray = raster2array(cost_surface_path)
    
    createShape(vector_path, line, s_projection)
    rasterize(vector_path, cost_surface_path, raster_path)

    line_as_array = raster2array(raster_path)
    path_cost =  np.sum(costSurfaceArray*line_as_array)
    return {'item': item, 'cost': float(path_cost), 
                            'geom': str(line.ExportToWkt())}    
    
def calculateCostInformedPath(cost_surface_path, path_result, file_prefix,
                                start_coord, stop_coord, informed_path):

    line_raster_path = os.path.join(path_result,'%s_%s.tiff'% (file_prefix, INFORMED_PATH_COST))
    line_vector_path = os.path.join(path_result,'%s_%s.shp'% (file_prefix, INFORMED_PATH_COST))
    
    line = getFirstLine(informed_path)    
    
    return calculateCost(INFORMED_PATH_COST, cost_surface_path, path_result, file_prefix,
                  line, line_vector_path, line_raster_path)
                            

def calculateCostCartesianStraightLine(cost_surface_path, path_result, file_prefix,
                            start_coord, stop_coord):
        line_raster_path = os.path.join(path_result,'%s_%s.tiff'% (file_prefix, CARTESIAN_STRAIGHT_LINE_COST))
        line_vector_path = os.path.join(path_result,'%s_%s.shp'% (file_prefix, CARTESIAN_STRAIGHT_LINE_COST))
                               
        line = createCartesianLineGeom(start_coord, stop_coord)

        return calculateCost(CARTESIAN_STRAIGHT_LINE_COST, cost_surface_path, path_result, file_prefix,
                  line, line_vector_path, line_raster_path)

def calculateCostBestPath(cost_surface_path, path_result, file_prefix,
                            start_coord, stop_coord):
    line_raster_path = os.path.join(path_result,'%s_%s.tiff'% (file_prefix, BEST_PATH))
    line_vector_path = os.path.join(path_result,'%s_%s.shp'% (file_prefix, BEST_PATH))
                                         
    pathArray, indices = createPath(cost_surface_path, start_coord, stop_coord) # creates path array
    line = createCartesianLineStringGeom(pixelsOffset2coord(cost_surface_path, indices))
    
    return calculateCost(BEST_PATH, cost_surface_path, path_result, file_prefix,
                  line, line_vector_path, line_raster_path)   
                  
                  
def calculateCostBestPathLUT(cost_surface_path, path_result, file_prefix,
                            start_coord, stop_coord, luts):
    line_raster_path = os.path.join(path_result,'%s_%s.tiff'% (file_prefix, BEST_PATH_LUT))
    line_vector_path = os.path.join(path_result,'%s_%s.shp'% (file_prefix, BEST_PATH_LUT))
    new_cost_surface_path = os.path.join(path_result,'%s_lut_cost_%s.tiff'% (file_prefix, BEST_PATH_LUT))
    
    lookUpTable(cost_surface_path, new_cost_surface_path, luts)
                                         
    pathArray, indices = createPath(new_cost_surface_path, start_coord, stop_coord) # creates path array
    line = createCartesianLineStringGeom(pixelsOffset2coord(cost_surface_path, indices))
    
    return calculateCost(BEST_PATH_LUT, cost_surface_path, path_result, file_prefix,
                  line, line_vector_path, line_raster_path)  
                  
    
def calculateCostBestPathWithinBuffer(cost_surface_path, path_result, file_prefix,
                            start_coord, stop_coord, buffer_km):
    line_raster_path = os.path.join(path_result,'%s_%s.tiff'% (file_prefix, BEST_PATH_WITHIN_BUFFER))
    line_vector_path = os.path.join(path_result,'%s_%s.shp'% (file_prefix, BEST_PATH_WITHIN_BUFFER))
    buffer_vector_path = os.path.join(path_result,'%s_buffer_%s.shp'% (file_prefix, BEST_PATH_WITHIN_BUFFER))
    buffer_cost_path = os.path.join(path_result,'%s_buffer_cost_%s.tiff'% (file_prefix, BEST_PATH_WITHIN_BUFFER))
    
    s_raster = gdal.Open(cost_surface_path)
    s_projection = osr.SpatialReference(s_raster.GetProjectionRef())  
    costSurfaceArray = raster2array(cost_surface_path)
    
    base_line = createCartesianLineGeom(start_coord, stop_coord)
                           
    createShape(buffer_vector_path, base_line.Buffer(((1.0/60)/1.852)*buffer_km), s_projection)
    rasterize(buffer_vector_path, cost_surface_path, buffer_cost_path)
    buffer_raster_array = raster2array(buffer_cost_path)

    costSurface_10km = costSurfaceArray * buffer_raster_array
    array2raster(buffer_cost_path, cost_surface_path, costSurface_10km, None, True)
    
    pathArray, indices = createPath(buffer_cost_path, start_coord, stop_coord) # creates path array
    line = createCartesianLineStringGeom(pixelsOffset2coord(cost_surface_path, indices))
    
    return calculateCost(BEST_PATH_WITHIN_BUFFER, cost_surface_path, path_result, file_prefix,
                  line, line_vector_path, line_raster_path)   


def main(args = None):
    if len(args) == 1:
        return 1
    fileName = args[1]
    if os.path.isfile(fileName):
        parFile = open(fileName)
        contents =  parFile.read()
        try:
            parameters = yaml.load(contents)
        except:
            return 1
        parFile.close()
        
        errors = []
        resultList = []
        
        cost_surface_path = parameters['cost_surface_path']
        path_result = parameters['pathresult']
            
        if not os.path.isdir(path_result):
            os.makedirs(path_result)
        
        fileResultsDic = {}
        fileResultsDic['parameters'] = parameters
        
        processes = parameters['processes']
        for k, v in processes.iteritems():
            start_coord = v['start_coord']
            stop_coord = v['stop_coord']
            calculation_type = v['calculation_type']
            file_prefix = v['file_prefix']
            if calculation_type == INFORMED_PATH_COST:
                informed_path = v['informed_path'] if 'informed_path' in v and\
                                        os.path.isfile(v['informed_path']) else None
                if informed_path:
                    result = calculateCostInformedPath(cost_surface_path, path_result, file_prefix,
                                    start_coord, stop_coord, informed_path)
                    result['process'] = '%s_%s'%(k, file_prefix)
                    resultList.append(result)
                else:
                    errors.append('process: %s - calculation type: %s - \
                                    Msg: The path is not valid'%(k, calculation_type))
                                    
            elif calculation_type == CARTESIAN_STRAIGHT_LINE_COST:
                result = calculateCostCartesianStraightLine(cost_surface_path, path_result, file_prefix,
                                start_coord, stop_coord)
                result['process'] = '%s_%s'%(k, file_prefix)
                resultList.append(result)
                
            elif calculation_type == BEST_PATH_WITHIN_BUFFER:
                buffer_km = v['buffer_km'] if 'buffer_km' in v and\
                                        isinstance(v['buffer_km'], (int, long, float)) else None
                if buffer_km:
                    result = calculateCostBestPathWithinBuffer(cost_surface_path, path_result, file_prefix,
                                        start_coord, stop_coord, buffer_km)
                    result['process'] = '%s_%s'%(k, file_prefix)
                    resultList.append(result)
                else:
                    errors.append("process: %s - calculation type: %s - \
                                    Msg: buffer_km isn't a number"%(k, calculation_type))
            elif calculation_type == BEST_PATH_LUT:
                lut = v['lut'] if 'lut' in v else None
                if lut:
                    result = calculateCostBestPathLUT(cost_surface_path, path_result, file_prefix,
                                        start_coord, stop_coord, lut)
                    result['process'] = '%s_%s'%(k, file_prefix)
                    resultList.append(result)
                else:
                    errors.append("process: %s - calculation type: %s - \
                                    Msg: lut was not informed "%(k, calculation_type))
            elif calculation_type == BEST_PATH:
                result = calculateCostBestPath(cost_surface_path, path_result, file_prefix,
                                    start_coord, stop_coord)
                result['process'] = '%s_%s'%(k, file_prefix)
                resultList.append(result)
            else:
                errors.append('process: %s - Msg: Calculation Type: %s is invalid'%(k, calculation_type))
           
        
        fileResultsDic['results'] = resultList
        fileResultsDic['errors'] = errors
        
        strResult = yaml.safe_dump(fileResultsDic)
        fileName = 'result.yaml'
        f = open( os.path.join(path_result, fileName), 'w')
        f.write(strResult)
        f.close()
        
    
if __name__ == '__main__':
    sys.exit(main(sys.argv))