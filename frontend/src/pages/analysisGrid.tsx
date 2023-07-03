import React, { useState, useEffect } from "react";
import {
    Grid,
    GridColumn,
    getSelectedState,
    getSelectedStateFromKeyDown,
    GridFilterChangeEvent,
} from "@progress/kendo-react-grid";
import SubBuildingList from "../component/SubBuildingComponent/subBuildingList";
import SubBuildingTotalAnalysisTable from "../component/SubBuildingComponent/subBuildingTotalAnalysisTable";
import { subBuildingInfo_interface } from "../interface/subBuildingInfo_interface";
import { buildingInfo_interface } from "./../interface/buildingInfo_interface";
import { subBuildingTotalAnalysisTable1_interface } from "./../interface/subBuildingTotalAnalysisTable1_interface";
import { subBuildingTotalAnalysisTable2_interface } from "./../interface/subBuildingTotalAnalysisTable2_interface";

import axios from "axios";
import urlPrefix from "./../resource/URL_prefix.json";

const SubBuildingDetail = (props: any) => {
    const [buildingInfo, setBuildingInfo] = useState<
        buildingInfo_interface | undefined
    >();
    const [subBuildingInfo, setSubBuildingInfo] = useState<
        subBuildingInfo_interface | undefined
    >();
    const [selectedSubBuildingId, setSelectedSubBuildingId] = useState<number>();

    const [analysisTable1, setAnalysisTable1] =
        useState<subBuildingTotalAnalysisTable1_interface[]>();
    const [analysisTable1Grid, setAnalysisTable1Grid] = useState<string[][]>([]);

    const [analysisTable2, setAnalysisTable2] =
        useState<subBuildingTotalAnalysisTable2_interface[]>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setBuildingInfo(props.buildingInfo);

                const response = await axios.get(
                    urlPrefix.IP_port + "/sub_building/" + props.buildingInfo.id
                );

                const subBuildings = JSON.parse(response.data);
                setSubBuildingInfo(subBuildings);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [props]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setBuildingInfo(props.buildingInfo);

                const response1 = await axios.get(
                    urlPrefix.IP_port +
                    "/sub_building/total_analysis_table1/" +
                    props.buildingInfo.id
                );
                const response2 = await axios.get(
                    urlPrefix.IP_port +
                    "/sub_building/total_analysis_table1/" +
                    props.buildingInfo.id
                );
                setAnalysisTable1(JSON.parse(response1.data));
                setAnalysisTable2(JSON.parse(response2.data));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [buildingInfo]);

    useEffect(() => {
        if (analysisTable1) {
            let tableGrid = [];
            tableGrid.push(["구분", "콘크리트(㎥)", "거푸집(㎡)", "철근(Ton)"]);
            tableGrid.push([
                "총물량",
                analysisTable1[0].total_concrete.toFixed(2),
                analysisTable1[0].total_formwork.toFixed(2),
                analysisTable1[0].total_rebar.toFixed(2),
            ]);
            tableGrid.push([
                "연면적",
                analysisTable1[0].con_floor_area_meter.toFixed(2),
                analysisTable1[0].form_floor_area_meter.toFixed(2),
                analysisTable1[0].reb_floor_area_meter.toFixed(2),
            ]);
            tableGrid.push([
                "평당/평",
                analysisTable1[0].con_floor_area_pyeong.toFixed(2),
                analysisTable1[0].form_floor_area_pyeong.toFixed(2),
                analysisTable1[0].reb_floor_area_pyeong.toFixed(2),
            ]);
            tableGrid.push([
                "콘크리트 m^당 값",
                "",
                analysisTable1[0].form_con_result.toFixed(2),
                analysisTable1[0].reb_con_result.toFixed(2),
            ]);

            setAnalysisTable1Grid(tableGrid);
        }
    }, [analysisTable1]);

    return (
        <div className="sub-building-list">
            <SubBuildingList
                buildingInfo={buildingInfo}
                setSelectedSubBuildingId={setSelectedSubBuildingId}
            />

            {analysisTable1Grid && analysisTable1Grid.length > 0 && (
                <Grid data={analysisTable1Grid}>
                    {analysisTable1Grid[0].map((column, columnIndex) => (
                        <GridColumn
                            key={columnIndex}
                            field={columnIndex.toString()}
                            title={column}
                        />
                    ))}
                </Grid>
            )}

            <div className="sub-building-detail">
                <SubBuildingTotalAnalysisTable
                    buildingId={buildingInfo?.id}
                    subBuildingInfo={subBuildingInfo}
                    selectedSubBuildingId={selectedSubBuildingId}
                />
            </div>
        </div>
    );
};

export default SubBuildingDetail;
