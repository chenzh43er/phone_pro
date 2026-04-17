import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.0.0/+esm';

/**
 * Supabase 初始化
 */
const supabase = createClient(
    'https://tgwfqxviodotwlwzgrmm.supabase.co',
    'sb_publishable_vTY-aFmtXLOdXodx4cN1uw_Owi8ooxW'
);

export async function fetchStateCounts() {
    try {
        const { data, error } = await supabase.rpc(
            'get_state_counts'   // 无参数函数
        );

        if (error) throw new Error(error.message);

        return { data, error: null };
    } catch (err) {
        console.error('fetchStateCounts 错误:', err);
        return { data: null, error: err.message };
    }
}

export async function fetchProvidersByState(stateName) {
    try {
        const { data, error } = await supabase.rpc(
            'get_providers_by_state',
            {
                p_state: stateName  // ⚠️ 必须和 SQL 参数名一致
            }
        );

        if (error) throw new Error(error.message);

        return { data, error: null };
    } catch (err) {
        console.error('fetchProvidersByState 错误:', err);
        return { data: null, error: err.message };
    }
}

export async function fetchProviderById(id) {
    try {
        const { data, error } = await supabase.rpc(
            'get_provider_by_id',
            { p_id: id }
        );

        if (error) throw new Error(error.message);

        // 因为是 SETOF，取第一条
        return { data: data?.[0] || null, error: null };
    } catch (err) {
        console.error('fetchProviderById 错误:', err);
        return { data: null, error: err.message };
    }
}


export async function renderStateList() {
    const { data, error } = await fetchStateCounts();

    if (error) {
        console.error('加载州数据失败:', error);
        return;
    }

    const container = document.getElementById('stateList');
    container.innerHTML = '';

    data.forEach(item => {
        const li = document.createElement('li');

        li.innerHTML = `
            <a href="/provider/state/${formatStateUrl(item.state)}/">
                <span class="location_box">
                    <svg class="location">
                        <use xlink:href="#location"></use>
                    </svg>
                </span>
                <span class="statetitle statetitleleft">${item.state}</span>
                <span class="statetitle statetitleright">
                    ${item.total_count} Providers
                    <svg class="next"><use xlink:href="#next"></use></svg>
                </span>
            </a>
        `;

        container.appendChild(li);
    });
}