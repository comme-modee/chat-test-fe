import React, { useEffect } from 'react';

const Map = ({ location }) => {
    useEffect(() => {
        const loadKakaoMap = () => {
            const { kakao } = window;
            if (kakao && kakao.maps) {
                const container = document.getElementById('map');
                const geocoder = new kakao.maps.services.Geocoder();

                geocoder.addressSearch(location, (result, status) => {
                    if (status === kakao.maps.services.Status.OK) {
                        const addressList = result.map((it) => ({
                            address: it.road_address.address_name,
                            buildingName: it.road_address.building_name,
                            centerX: it.road_address.x,
                            centerY: it.road_address.y,
                        }));

                        const options = {
                            center: new kakao.maps.LatLng(addressList[0].centerY, addressList[0].centerX),
                            isPanto: true, // 부드럽게 보여짐
                            level: 3, // 확대 레벨
                        };

                        const marker = new kakao.maps.Marker({
                            position: new kakao.maps.LatLng(addressList[0].centerY, addressList[0].centerX),
                            title: addressList[0].buildingName
                        });

                        const infowindow = new kakao.maps.InfoWindow({
                            content: `<div style="width:150px;text-align:center;padding:6px 0;">${addressList[0].buildingName}</div>`
                        });

                        const map = new kakao.maps.Map(container, options);
                        marker.setMap(map);
                        infowindow.open(map, marker);
                    }
                });
            } else {
                setTimeout(loadKakaoMap, 100); // Kakao Maps API가 로드될 때까지 100ms마다 체크
            }
        };

        loadKakaoMap();
    }, [location]);

    return (
        <div id="map" style={{ width: '100%', maxWidth: "1000px", height: "300px" }}></div>
    );
};

export default Map;
